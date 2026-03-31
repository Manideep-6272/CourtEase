require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MULTER SETUP =================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "court-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

// Serve static files from uploads folder
app.use("/uploads", express.static(uploadsDir));

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

    console.log(`[LOGIN] Attempting login - Phone: ${phone}, Role: ${role}`);

    const userExist = await pool.query(
      "SELECT * FROM users WHERE phone=$1 AND role=$2",
      [phone, role],
    );

    if (userExist.rows.length === 0) {
      console.log(`[LOGIN] User not found - Phone: ${phone}, Role: ${role}`);
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const user = userExist.rows[0];
    console.log(`[LOGIN] User found: ${user.name} (role: ${user.role})`);

    if (!user.is_active) {
      console.log(`[LOGIN] User is blocked`);
      return res.status(400).json({ message: "User blocked" });
    }

    if (user.role === "owner" && user.approval_status !== "approved") {
      console.log(`[LOGIN] Owner not approved`);
      return res.status(400).json({ message: "Owner not approved" });
    }

    console.log(`[LOGIN] Comparing password...`);
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(`[LOGIN] Password match result: ${isMatch}`);
    // console.log(`[LOGIN] Stored hash: ${user.password}`);

    if (!isMatch) {
      console.log(`[LOGIN] Password mismatch for user: ${phone}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    console.log(`[LOGIN] Login successful for user: ${phone}`);
    res.json({
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(`[LOGIN ERROR]`, err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= COURTS =================

app.post("/courts", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, sport, location, city, price_per_hour } = req.body;

    // Get image URL if uploaded
    const imageUrl = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : null;

    const newCourt = await pool.query(
      `INSERT INTO courts (owner_id, name, sport, location, city, price_per_hour, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [ownerId, name, sport, location, city, price_per_hour, imageUrl],
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

  const courts = await pool.query("SELECT * FROM courts WHERE owner_id=$1", [
    ownerId,
  ]);

  res.json(courts.rows);
});
app.get("/getcourts", async (req, res) => {
  try {
    const courts = await pool.query(`
      SELECT 
        c.id,
        c.owner_id,
        c.name,
        c.sport,
        c.location,
        c.city,
        c.price_per_hour,
        c.description,
        c.amenities,
        c.capacity,
        c.image_url,
        c.is_active,
        c.created_at,
        c.updated_at,
        u.name as owner_name,
        u.phone as owner_phone,
        u.email as owner_email
      FROM courts c
      JOIN users u ON c.owner_id = u.id
      WHERE c.is_active = true
      ORDER BY c.created_at DESC
    `);
    res.json(courts.rows);
  } catch (err) {
    console.error("Error fetching courts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET COURTS BY CITY AND SPORT =================
app.get("/getcourtsbylocation", async (req, res) => {
  try {
    const { city, sport } = req.query;

    let query = `
      SELECT 
        c.id,
        c.owner_id,
        c.name,
        c.sport,
        c.location,
        c.city,
        c.price_per_hour,
        c.description,
        c.amenities,
        c.capacity,
        c.image_url,
        c.is_active,
        c.created_at,
        c.updated_at,
        u.name as owner_name,
        u.phone as owner_phone,
        u.email as owner_email
      FROM courts c
      JOIN users u ON c.owner_id = u.id
      WHERE c.is_active = true
    `;

    const params = [];

    // Filter by city
    if (city) {
      query += ` AND LOWER(c.city) = LOWER($${params.length + 1})`;
      params.push(city);
    }

    // Filter by sport
    if (sport) {
      query += ` AND LOWER(c.sport) = LOWER($${params.length + 1})`;
      params.push(sport);
    }

    query += ` ORDER BY c.created_at DESC`;

    const courts = await pool.query(query, params);
    res.json(courts.rows);
  } catch (err) {
    console.error("Error fetching courts by location:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= EDIT COURT =================

app.put("/courts/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const ownerId = req.user.id;
    const courtId = req.params.id;

    const { name, sport, location, city, price_per_hour } = req.body;

    // Get image URL if uploaded, otherwise keep existing
    let imageUrl = req.body.existing_image_url || null;
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const updatedCourt = await pool.query(
      `
      UPDATE courts
      SET name=$1,
          sport=$2,
          location=$3,
          city=$4,
          price_per_hour=$5,
          image_url=$6
      WHERE id=$7 AND owner_id=$8
      RETURNING *
      `,
      [name, sport, location, city, price_per_hour, imageUrl, courtId, ownerId],
    );

    if (updatedCourt.rows.length === 0) {
      return res.status(404).json({
        message: "Court not found or not authorized",
      });
    }

    res.json({
      message: "Court updated successfully",
      court: updatedCourt.rows[0],
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
    await pool.query(`DELETE FROM bookings WHERE court_id=$1`, [courtId]);

    // 🔥 Delete slots
    await pool.query(`DELETE FROM court_slots WHERE court_id=$1`, [courtId]);

    // 🔥 Delete court
    const deletedCourt = await pool.query(
      `
      DELETE FROM courts
      WHERE id=$1 AND owner_id=$2
      RETURNING *
      `,
      [courtId, ownerId],
    );

    if (deletedCourt.rows.length === 0) {
      return res.status(404).json({
        message: "Court not found or not authorized",
      });
    }

    res.json({
      message: "Court deleted successfully",
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
      [userId],
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
app.get("/admin/fetchusers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await pool.query(
      "SELECT id, name, phone, role, is_active FROM users where role=$1",
      ["user"],
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/admin/fetchowners", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const owners = await pool.query(
      "SELECT id, name, phone, approval_status FROM users WHERE role = $1",
      ["owner"],
    );
    res.json(owners.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/admin/fetchPendingOwners", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const pendingOwners = await pool.query(
      "SELECT id, name, phone FROM users WHERE role = $1 AND approval_status = $2",
      ["owner", "pending"],
    );
    res.json(pendingOwners.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/admin/owners/:id/updateStatus", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.params.id;
    const { status } = req.body;

    await pool.query(
      "UPDATE users SET approval_status = $1 WHERE id = $2 AND role = $3",
      [status, ownerId, "owner"],
    );
    res.json({ message: "Owner status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.delete(
  "/admin/owners/:id/deleteOwner",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const ownerId = req.params.id;
      await pool.query("DELETE FROM users WHERE id = $1 AND role = $2", [
        ownerId,
        "owner",
      ]);
      res.json({ message: "Owner rejected and deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

// ================= PROFILE ENDPOINTS =================

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await pool.query(
      "SELECT id, name, email, phone, role, city FROM users WHERE id = $1",
      [userId],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, city } = req.body;

    const updated = await pool.query(
      "UPDATE users SET name = $1, email = $2, city = $3 WHERE id = $4 RETURNING id, name, email, phone, role, city",
      [name, email, city, userId],
    );

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Password and newPassword are required" });
    }

    // Get user
    const user = await pool.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashpwd = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashpwd,
      userId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN STATISTICS =================

app.get("/admin/stats", authMiddleware, async (req, res) => {
  try {
    // Check admin access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // USERS
    const users = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END), 0) AS active
      FROM users
      WHERE LOWER(role) = 'user'
    `);

    // OWNERS
    const owners = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN approval_status = 'approved' THEN 1 ELSE 0 END), 0) AS approved
      FROM users
      WHERE LOWER(role) = 'owner'
    `);

    // COURTS
    const courts = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END), 0) AS active
      FROM courts
    `);

    // BOOKINGS
    const bookings = await pool.query(`
      SELECT COUNT(*) AS total FROM bookings
    `);

    // TODAY REVENUE
    const todayRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS revenue
      FROM bookings
      WHERE booking_date = CURRENT_DATE
      AND payment_status = 'completed'
    `);

    // MONTH REVENUE
    const monthRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS revenue
      FROM bookings
      WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'
      AND payment_status = 'completed'
    `);

    // DEBUG LOG (optional, remove later)
    console.log({
      users: users.rows[0],
      owners: owners.rows[0],
      courts: courts.rows[0],
    });

    // RESPONSE
    res.json({
      totalUsers: parseInt(users.rows[0].total) || 0,
      activeUsers: parseInt(users.rows[0].active) || 0,

      totalOwners: parseInt(owners.rows[0].total) || 0,
      approvedOwners: parseInt(owners.rows[0].approved) || 0,

      totalCourts: parseInt(courts.rows[0].total) || 0,
      activeCourts: parseInt(courts.rows[0].active) || 0,

      totalBookings: parseInt(bookings.rows[0].total) || 0,

      todayRevenue: parseFloat(todayRevenue.rows[0].revenue) || 0,
      monthRevenue: parseFloat(monthRevenue.rows[0].revenue) || 0,
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN CHART DATA =================

app.get("/admin/chart-data", authMiddleware, async (req, res) => {
  try {
    // Check admin access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // REVENUE DATA - Last 30 days
    const revenueData = await pool.query(`
      SELECT 
        DATE(booking_date) as date,
        COALESCE(SUM(amount), 0) as revenue
      FROM bookings
      WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'
      AND payment_status = 'completed'
      GROUP BY DATE(booking_date)
      ORDER BY DATE(booking_date) ASC
    `);

    // BOOKINGS DATA - Last 30 days
    const bookingsData = await pool.query(`
      SELECT 
        DATE(booking_date) as date,
        COUNT(*) as count
      FROM bookings
      WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(booking_date)
      ORDER BY DATE(booking_date) ASC
    `);

    // USERS GROWTH - Last 30 days
    const usersData = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE role = 'user'
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    // COURTS STATUS (Active vs Inactive)
    const courtsStatus = await pool.query(`
      SELECT 
        is_active,
        COUNT(*) as count
      FROM courts
      GROUP BY is_active
    `);

    // Format revenue chart data
    const revenue = revenueData.rows.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(row.revenue),
      fullDate: row.date
    }));

    // Format bookings chart data
    const bookings = bookingsData.rows.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: parseInt(row.count),
      fullDate: row.date
    }));

    // Format users chart data
    const users = usersData.rows.map(row => ({
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: parseInt(row.count),
      fullDate: row.date
    }));

    // Format courts pie chart data
    const courts = {
      active: parseInt(courtsStatus.rows.find(r => r.is_active === true)?.count || 0),
      inactive: parseInt(courtsStatus.rows.find(r => r.is_active === false)?.count || 0)
    };

    res.json({
      revenue,
      bookings,
      users,
      courts
    });
  } catch (err) {
    console.error("Admin Chart Data Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OWNER STATISTICS =================

app.get("/owner/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.user.id;

    // Total courts
    const courts = await pool.query(
      "SELECT COUNT(*) as total FROM courts WHERE owner_id = $1",
      [ownerId],
    );

    // Today's bookings
    const todayBookings = await pool.query(
      "SELECT COUNT(*) as total FROM bookings b JOIN courts c ON b.court_id = c.id WHERE c.owner_id = $1 AND b.booking_date = CURRENT_DATE",
      [ownerId],
    );

    // Today's earnings
    const todayEarnings = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM bookings b JOIN courts c ON b.court_id = c.id WHERE c.owner_id = $1 AND b.booking_date = CURRENT_DATE AND b.payment_status = $2",
      [ownerId, "completed"],
    );

    // This week's earnings (last 7 days)
    const weekEarnings = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM bookings b JOIN courts c ON b.court_id = c.id WHERE c.owner_id = $1 AND b.booking_date >= CURRENT_DATE - INTERVAL '7 days' AND b.payment_status = $2",
      [ownerId, "completed"],
    );

    // This month's earnings (last 30 days)
    const monthEarnings = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM bookings b JOIN courts c ON b.court_id = c.id WHERE c.owner_id = $1 AND b.booking_date >= CURRENT_DATE - INTERVAL '30 days' AND b.payment_status = $2",
      [ownerId, "completed"],
    );

    // Total earnings (all time)
    const totalEarnings = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM bookings b JOIN courts c ON b.court_id = c.id WHERE c.owner_id = $1 AND b.payment_status = $2",
      [ownerId, "completed"],
    );

    // Active slots today
    const activeSlots = await pool.query(
      "SELECT COUNT(*) as total FROM court_slots cs JOIN courts c ON cs.court_id = c.id WHERE c.owner_id = $1",
      [ownerId],
    );

    res.json({
      totalCourts: parseInt(courts.rows[0].total),
      todayBookings: parseInt(todayBookings.rows[0].total),
      todayEarnings: parseFloat(todayEarnings.rows[0].total),
      weekEarnings: parseFloat(weekEarnings.rows[0].total),
      monthEarnings: parseFloat(monthEarnings.rows[0].total),
      totalEarnings: parseFloat(totalEarnings.rows[0].total),
      activeSlots: parseInt(activeSlots.rows[0].total),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OWNER EARNINGS HISTORY =================

app.get("/owner/earnings-history", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.user.id;

    // Earnings by court for last 30 days
    const earningsByDate = await pool.query(`
      SELECT 
        b.booking_date as date,
        c.id as court_id,
        c.name as court_name,
        COUNT(b.id) as bookings_count,
        COALESCE(SUM(b.amount), 0) as earnings
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      WHERE c.owner_id = $1
      AND b.booking_date >= CURRENT_DATE - INTERVAL '30 days'
      AND b.payment_status = 'completed'
      GROUP BY b.booking_date, c.id, c.name
      ORDER BY b.booking_date DESC
    `, [ownerId]);

    // Total by court (all time)
    const earningsByCourt = await pool.query(`
      SELECT 
        c.id as court_id,
        c.name as court_name,
        c.sport,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(b.amount), 0) as total_earnings
      FROM courts c
      LEFT JOIN bookings b ON b.court_id = c.id AND b.payment_status = 'completed'
      WHERE c.owner_id = $1
      GROUP BY c.id, c.name, c.sport
      ORDER BY total_earnings DESC
    `, [ownerId]);

    // Today's bookings details
    const todayBookingsDetail = await pool.query(`
      SELECT 
        b.id,
        b.booking_date,
        c.name as court_name,
        c.sport,
        cs.slot_time,
        b.amount,
        b.booking_status,
        b.payment_status,
        u.name as user_name
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      JOIN court_slots cs ON b.slot_id = cs.id
      JOIN users u ON b.user_id = u.id
      WHERE c.owner_id = $1
      AND b.booking_date = CURRENT_DATE
      ORDER BY cs.slot_time ASC
    `, [ownerId]);

    res.json({
      earningsByDate: earningsByDate.rows.map(row => ({
        date: row.date,
        courtId: row.court_id,
        courtName: row.court_name,
        bookingsCount: parseInt(row.bookings_count),
        earnings: parseFloat(row.earnings)
      })),
      earningsByCourt: earningsByCourt.rows.map(row => ({
        courtId: row.court_id,
        courtName: row.court_name,
        sport: row.sport,
        totalBookings: parseInt(row.total_bookings),
        totalEarnings: parseFloat(row.total_earnings)
      })),
      todayBookings: todayBookingsDetail.rows.map(row => ({
        id: row.id,
        courtName: row.court_name,
        sport: row.sport,
        time: row.slot_time,
        userName: row.user_name,
        amount: parseFloat(row.amount),
        bookingStatus: row.booking_status,
        paymentStatus: row.payment_status
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= USER STATUS MANAGEMENT =================

app.put("/admin/users/:id/toggle-status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    // Get current status
    const user = await pool.query("SELECT is_active FROM users WHERE id = $1", [
      userId,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = !user.rows[0].is_active;

    // Update status
    await pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [
      newStatus,
      userId,
    ]);

    res.json({
      message: `User ${newStatus ? "unblocked" : "blocked"} successfully`,
      is_active: newStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CONTACT FORM =================

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    // Insert contact message
    await pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message],
    );

    res.json({
      message: "Thank you for contacting us. We will get back to you soon.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OWNER BOOKINGS =================

app.get("/owner/bookings", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ownerId = req.user.id;

    const bookings = await pool.query(
      `
  SELECT 
    b.id,
    b.user_id,
    b.court_id,
    c.name AS court_name,
    c.sport,
    c.location,
    u.name AS user_name,
    u.phone,
    b.booking_date,
    COALESCE(TO_CHAR(cs.slot_time, 'HH24:MI'), 'N/A') AS slot_time,
    c.price_per_hour,
    b.payment_status,
    b.booking_status
  FROM bookings b
  JOIN courts c ON b.court_id = c.id
  LEFT JOIN court_slots cs ON b.slot_id = cs.id
  JOIN users u ON b.user_id = u.id
  WHERE c.owner_id = $1
  ORDER BY b.booking_date DESC
`,
      [ownerId],
    );

    console.log("Owner ID:", ownerId);
    console.log("Bookings Found:", bookings.rows.length);

    res.json(bookings.rows);
  } catch (err) {
    console.error("Owner Bookings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= SEARCH COURTS =================

app.get("/courts/search", async (req, res) => {
  try {
    const { city, sport } = req.query;

    let query = "SELECT * FROM courts WHERE is_active = true";
    const params = [];

    if (city) {
      params.push(city);
      query += ` AND city ILIKE $${params.length}`;
    }

    if (sport) {
      params.push(sport);
      query += ` AND sport ILIKE $${params.length}`;
    }

    const courts = await pool.query(query, params);
    res.json(courts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= RAZORPAY PAYMENT =================

const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

// Create Razorpay Order
app.post("/create-razorpay-order", authMiddleware, async (req, res) => {
  try {
    const { amount, bookingDetails } = req.body;
    const userId = req.user.id;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // Amount in paise (multiply by 100)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId,
        bookingDetails: JSON.stringify(bookingDetails),
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount / 100, // Convert back to rupees
      currency: order.currency,
    });
  } catch (err) {
    console.error("[Payment] Error creating Razorpay order:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
});

// Verify Payment & Create Booking
app.post("/verify-razorpay-payment", authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingData } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "test_secret");
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Payment verified - Create booking
    const { courtId, slotIds, bookingDate, amount } = bookingData;

    if (!courtId || !slotIds || !bookingDate) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // Create booking for each slot
    const bookings = [];
    for (const slotId of slotIds) {
      const booking = await pool.query(
        `INSERT INTO bookings (user_id, court_id, slot_id, booking_date, amount, payment_status, booking_status, payment_method)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [userId, courtId, slotId, bookingDate, amount / slotIds.length, "completed", "confirmed", "razorpay"]
      );
      bookings.push(booking.rows[0]);
    }

    // Create payment record
    await pool.query(
      `INSERT INTO payments (booking_id, user_id, amount, payment_method, transaction_id, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [bookings[0].id, userId, amount, "razorpay", paymentId, "completed"]
    );

    res.json({
      success: true,
      message: "Booking confirmed",
      bookings: bookings,
    });
  } catch (err) {
    console.error("[Payment] Error verifying payment:", err);
    res.status(500).json({ message: "Failed to process booking", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
