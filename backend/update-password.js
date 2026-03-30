require("dotenv").config();
const pool = require("./db");

const newHash = "$2b$10$U.Ry4HP6Z7Z..Vu0AH677e6MuX80bFLjQxtJX0xDlfifYsBX3Qu.6";

async function updatePassword() {
  try {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE phone = $2 AND role = $3 RETURNING id, phone, role, password",
      [newHash, "9999999999", "admin"]
    );
    
    console.log("Password updated successfully!");
    console.log("User:", result.rows[0]);
  } catch (err) {
    console.error("Error updating password:", err);
  } finally {
    pool.end();
  }
}

updatePassword();
