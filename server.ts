import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Railway DATABASE_URL connection
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
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

// ✅ Admin login route
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        user: rows[0]
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all news
app.get("/api/news", async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM news ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE news
app.post("/api/news", async (req, res) => {
  try {
    const { title, content, image_url } = req.body;

    await pool.query(
      "INSERT INTO news (title, content, image_url) VALUES (?, ?, ?)",
      [title, content, image_url]
    );

    res.json({
      success: true,
      message: "News created successfully"
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ IMPORTANT for Vercel
export default app;