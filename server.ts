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
    res.status(500).json({
      status: "error",
      error: err.message
    });
  }
});


// ✅ TEST route (admin table check)
app.get("/api/admin/test", async (req, res) => {
  try {
    const [rows]: any = await pool.query("SELECT * FROM admin");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ✅ Admin login route (FIXED with token)
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {

      // token generate
      const token = "admin-token-" + Date.now();

      res.json({
        success: true,
        message: "Login successful",
        token: token,
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


// ✅ Admin stats route
app.get("/api/admin/stats", async (req, res) => {
  try {
    const [posts]: any = await pool.query(
      "SELECT * FROM news ORDER BY id DESC"
    );

    res.json({
      totalStats: {
        total_views: 0,
        total_likes: 0,
        total_comments: 0,
        total_shares: 0,
        total_clicks: 0
      },
      posts: posts
    });

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


// ✅ Posts route
app.get("/api/posts", async (req, res) => {
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM news ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Create post route
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, category } = req.body;

    await pool.query(
      "INSERT INTO news (title, content, category) VALUES (?, ?, ?)",
      [title, content, category]
    );

    res.json({
      success: true,
      message: "Post created successfully"
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ IMPORTANT for Vercel
export default app;