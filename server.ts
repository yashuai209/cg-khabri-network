import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(cors());
app.use(express.json());

// database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 10000
});
// health check route
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", message: "Database connected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// IMPORTANT: export default for Vercel
export default app;