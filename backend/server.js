require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ================= AUTH =================

app.post("/register", async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const existUser = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);

    if (existUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpwd = await bcrypt.hash(password, 10);
    const approved = role === "owner" ? "pending" : "approved";

    const newUser = await pool.query(
      `INSERT INTO users (name, phone, password, role, approval_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, role, approval_status`,
      [name, phone, hashpwd, role, approved],
    );

    res.status(201).json({
      message: "User Created Successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    const userExist = await pool.query(
      "SELECT * FROM users WHERE phone=$1 AND role=$2",
      [phone, role],
    );

    if (userExist.rows.length === 0) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const user = userExist.rows[0];

    if (!user.is_active)
      return res.status(400).json({ message: "User blocked" });

    if (user.role === "owner" && user.approval_status !== "approved") {
      return res.status(400).json({ message: "Owner not approved" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= COURTS =================

app.post("/courts", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, sport, location, city, price_per_hour } = req.body;

    const newCourt = await pool.query(
      `INSERT INTO courts (owner_id, name, sport, location, city, price_per_hour)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [ownerId, name, sport, location, city, price_per_hour],
    );

    const courtId = newCourt.rows[0].id;

    // 🔥 Generate 24 slots
    await pool.query(
      `
      INSERT INTO court_slots (court_id, slot_time, duration)
      SELECT $1, (gs)::time, 60
      FROM generate_series(
        '2000-01-01 00:00:00'::timestamp,
        '2000-01-01 23:00:00'::timestamp,
        interval '1 hour'
      ) AS gs
      ON CONFLICT (court_id, slot_time) DO NOTHING
      `,
      [courtId],
    );

    res.status(201).json({
      message: "Court + slots created",
      court: newCourt.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/mycourts", authMiddleware, async (req, res) => {
  const ownerId = req.user.id;

  const courts = await pool.query(
    "SELECT * FROM courts WHERE owner_id=$1",
    [ownerId]
  );

  res.json(courts.rows);
});
app.get("/getcourts", async (req, res) => {
  const courts = await pool.query("SELECT * FROM courts");
  res.json(courts.rows);
});
// ================= EDIT COURT =================

app.put("/courts/:id", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.id;
    const courtId = req.params.id;

    const { name, sport, location, city, price_per_hour } = req.body;

    const updatedCourt = await pool.query(
      `
      UPDATE courts
      SET name=$1,
          sport=$2,
          location=$3,
          city=$4,
          price_per_hour=$5
      WHERE id=$6 AND owner_id=$7
      RETURNING *
      `,
      [name, sport, location, city, price_per_hour, courtId, ownerId]
    );

    if (updatedCourt.rows.length === 0) {
      return res.status(404).json({
        message: "Court not found or not authorized"
      });
    }

    res.json({
      message: "Court updated successfully",
      court: updatedCourt.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= DELETE COURT =================

app.delete("/courts/:id", authMiddleware, async (req, res) => {
  try {

    const ownerId = req.user.id;
    const courtId = req.params.id;

    // 🔥 Delete bookings first
    await pool.query(
      `DELETE FROM bookings WHERE court_id=$1`,
      [courtId]
    );

    // 🔥 Delete slots
    await pool.query(
      `DELETE FROM court_slots WHERE court_id=$1`,
      [courtId]
    );

    // 🔥 Delete court
    const deletedCourt = await pool.query(
      `
      DELETE FROM courts
      WHERE id=$1 AND owner_id=$2
      RETURNING *
      `,
      [courtId, ownerId]
    );

    if (deletedCourt.rows.length === 0) {
      return res.status(404).json({
        message: "Court not found or not authorized"
      });
    }

    res.json({
      message: "Court deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= SLOTS =================

// 🔥 Get available slots
app.get("/courts/:courtId/slots", async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    const result = await pool.query(
      `
      SELECT 
        cs.id,
        cs.slot_time,
        CASE 
          WHEN b.id IS NOT NULL THEN true
          ELSE false
        END AS is_booked
      FROM court_slots cs
      LEFT JOIN bookings b
        ON cs.id = b.slot_id
        AND b.booking_date = $2
      WHERE cs.court_id = $1
      ORDER BY cs.slot_time
      `,
      [courtId, date],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slots" });
  }
});
// ================= BOOKINGS =================

app.post("/bookings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courtId, slotIds, bookingDate } = req.body;

    // 🔥 Prevent double booking
    const existing = await pool.query(
      `
      SELECT * FROM bookings
      WHERE court_id = $1
      AND booking_date = $2
      AND slot_id = ANY($3)
      `,
      [courtId, bookingDate, slotIds],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Some slots already booked",
      });
    }

    // 🔥 Insert bookings
    for (let slotId of slotIds) {
      await pool.query(
        `
        INSERT INTO bookings (user_id, court_id, slot_id, booking_date)
        VALUES ($1, $2, $3, $4)
        `,
        [userId, courtId, slotId, bookingDate],
      );
    }

    res.json({ message: "Booking successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});
app.get("/mybookings", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        b.id,
        c.name AS court,
        c.location,
        c.sport,
        b.booking_date,
        cs.slot_time
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      JOIN court_slots cs ON cs.id = b.slot_id
      WHERE b.user_id = $1
      ORDER BY b.booking_date DESC, cs.slot_time ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete("/bookings/:id", authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    await pool.query(`DELETE FROM bookings WHERE id=$1 AND user_id=$2`, [
      bookingId,
      userId,
    ]);

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});


// ADMIN ENDPOINTS
app.get('/admin/fetchusers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await pool.query('SELECT id, name, phone, role, is_active FROM users where role=$1', ['user']);
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/admin/fetchowners', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const owners = await pool.query('SELECT id, name, phone, approval_status FROM users WHERE role = $1', ['owner']);
    res.json(owners.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/admin/fetchPendingOwners', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pendingOwners = await pool.query('SELECT id, name, phone FROM users WHERE role = $1 AND approval_status = $2', ['owner', 'pending']);
    res.json(pendingOwners.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.put('/admin/owners/:id/updateStatus', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ownerId = req.params.id;
    const { status } = req.body;

    await pool.query('UPDATE users SET approval_status = $1 WHERE id = $2 AND role = $3', [status, ownerId, 'owner']);
    res.json({ message: 'Owner status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.delete('/admin/owners/:id/deleteOwner', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const ownerId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [ownerId, 'owner']);
    res.json({ message: 'Owner rejected and deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
