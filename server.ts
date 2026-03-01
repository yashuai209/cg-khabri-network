import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Railway DATABASE_URL connection (FINAL FIX)
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,   // Railway public URL use karega
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000
});

// ✅ Health check route
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      message: "Database connected successfully"
    });
  } catch (err: any) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});

// ✅ Example admin login route (optional)
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ IMPORTANT for Vercel
export default app;