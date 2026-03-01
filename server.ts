import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/lib/db.ts";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Feed } from "feed";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists (Skip on Vercel as it's read-only)
if (!process.env.VERCEL) {
  const uploadsDir = path.join(__dirname, "public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "cg-khabri-secret-key-123";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Multer setup for image uploads (Memory storage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload to Cloudinary
const uploadToCloudinary = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "cg-khabri" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || "");
      }
    );
    uploadStream.end(file.buffer);
  });
};

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- API Routes ---

app.post("/api/upload", authenticateToken, upload.single("image"), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const url = await uploadToCloudinary(req.file);
    res.json({ url });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

// RSS Feed for Google News / Dailyhunt
app.get("/feed.xml", async (req, res) => {
  try {
    const [posts] = await db.execute("SELECT * FROM posts ORDER BY created_at DESC LIMIT 50") as any[];
    const siteUrl = process.env.APP_URL || "https://cgkhabri.network";

    const feed = new Feed({
      title: "CG Khabri Network",
      description: "Chhattisgarh's No. 1 News Network",
      id: siteUrl,
      link: siteUrl,
      language: "hi",
      image: `${siteUrl}/logo.png`,
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, CG Khabri Network`,
      author: {
        name: "CG Khabri Team",
        email: "contact@cgkhabri.network",
        link: siteUrl
      }
    });

    posts.forEach((post: any) => {
      feed.addItem({
        title: post.title,
        id: `${siteUrl}/post/${post.slug}`,
        link: `${siteUrl}/post/${post.slug}`,
        description: post.seo_description || post.content.substring(0, 200).replace(/<[^>]*>/g, ''),
        content: post.content,
        author: [{ name: "CG Khabri Team" }],
        date: new Date(post.created_at),
        image: post.image_url ? (post.image_url.startsWith('http') ? post.image_url : `${siteUrl}${post.image_url}`) : undefined
      });
    });

    res.header("Content-Type", "application/xml");
    res.send(feed.rss2());
  } catch (err) {
    res.status(500).send("Error generating feed");
  }
});

// News Sitemap for Google
app.get("/sitemap-news.xml", async (req, res) => {
  try {
    const [posts] = await db.execute("SELECT * FROM posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 2 DAY) ORDER BY created_at DESC") as any[];
    const siteUrl = process.env.APP_URL || "https://cgkhabri.network";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    posts.forEach((post: any) => {
      xml += `
  <url>
    <loc>${siteUrl}/post/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>CG Khabri Network</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.created_at).toISOString()}</news:publication_date>
      <news:title>${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>`;
    });

    xml += `\n</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
});

// Auth
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]) as any[];
  const user = rows[0];
  if (!user) return res.status(400).json({ message: "User not found" });

  const validPassword = password === user.password || bcrypt.compareSync(password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.json({ token });
});

// Posts
app.get("/api/posts", async (req, res) => {
  const category = req.query.category;
  const featured = req.query.featured;
  const search = req.query.q;
  let query = "SELECT * FROM posts";
  const params: any[] = [];
  const conditions: string[] = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }
  if (featured) {
    conditions.push("is_featured = 1");
  }
  if (search) {
    conditions.push("(title LIKE ? OR content LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";
  console.log("API: Fetching posts with query:", query, "params:", params);
  const [posts] = await db.execute(query, params);
  console.log("API: Found", (posts as any[]).length, "posts");
  res.json(posts);
});

app.get("/api/posts/:slug", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM posts WHERE slug = ?", [req.params.slug]) as any[];
  const post = rows[0];
  if (!post) return res.status(404).json({ message: "Post not found" });
  
  await db.execute("UPDATE posts SET views = views + 1 WHERE id = ?", [post.id]);
  res.json(post);
});

// Analytics Endpoints
app.post("/api/posts/:id/like", async (req, res) => {
  await db.execute("UPDATE posts SET likes = likes + 1 WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.post("/api/posts/:id/share", async (req, res) => {
  await db.execute("UPDATE posts SET shares = shares + 1 WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.post("/api/posts/:id/click", async (req, res) => {
  await db.execute("UPDATE posts SET clicks = clicks + 1 WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

// Comments Endpoints
app.get("/api/posts/:id/comments", async (req, res) => {
  const [comments] = await db.execute("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC", [req.params.id]);
  res.json(comments);
});

app.post("/api/posts/:id/comments", async (req, res) => {
  const { author_name, content } = req.body;
  if (!author_name || !content) return res.status(400).json({ message: "Missing fields" });
  const [result] = await db.execute("INSERT INTO comments (post_id, author_name, content) VALUES (?, ?, ?)", [req.params.id, author_name, content]) as any;
  res.json({ id: result.insertId });
});

app.get("/api/admin/stats", authenticateToken, async (req, res) => {
  const [posts] = await db.execute(`
    SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count 
    FROM posts p 
    ORDER BY p.created_at DESC
  `);
  
  const [statsRows] = await db.execute(`
    SELECT 
      SUM(views) as total_views, 
      SUM(likes) as total_likes, 
      SUM(shares) as total_shares, 
      SUM(clicks) as total_clicks,
      (SELECT COUNT(*) FROM comments) as total_comments
    FROM posts
  `) as any[];
  const totalStats = statsRows[0];

  res.json({ posts, totalStats });
});

app.post("/api/posts", authenticateToken, upload.fields([{ name: "image", maxCount: 1 }, { name: "sponsor_image", maxCount: 1 }]), async (req: any, res) => {
  try {
    const { title, content, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, external_link } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Date.now();
    
    let image_url = "";
    if (req.files?.image) {
      image_url = await uploadToCloudinary(req.files.image[0]);
    }

    let sponsor_image_url = "";
    if (req.files?.sponsor_image) {
      sponsor_image_url = await uploadToCloudinary(req.files.sponsor_image[0]);
    }

    const [result] = await db.execute(
      "INSERT INTO posts (title, slug, content, image_url, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, sponsor_image, external_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title, slug, content, image_url, category, is_featured === "true" ? 1 : 0,
        tags, seo_title, seo_description, sponsor_name, sponsor_link, sponsor_image_url, external_link
      ]
    ) as any;
    res.json({ id: result.insertId, slug });
  } catch (error: any) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post: " + error.message });
  }
});

app.put("/api/posts/:id", authenticateToken, upload.fields([{ name: "image", maxCount: 1 }, { name: "sponsor_image", maxCount: 1 }]), async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const { title, content, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, external_link } = req.body;
    
    let image_url = undefined;
    if (req.files?.image) {
      image_url = await uploadToCloudinary(req.files.image[0]);
    }

    let sponsor_image_url = undefined;
    if (req.files?.sponsor_image) {
      sponsor_image_url = await uploadToCloudinary(req.files.sponsor_image[0]);
    }

    let query = "UPDATE posts SET title = ?, content = ?, category = ?, is_featured = ?, tags = ?, seo_title = ?, seo_description = ?, sponsor_name = ?, sponsor_link = ?, external_link = ?";
    const params = [
      title, content, category, is_featured === "true" ? 1 : 0,
      tags, seo_title, seo_description, sponsor_name, sponsor_link, external_link
    ];

    if (image_url) {
      query += ", image_url = ?";
      params.push(image_url);
    }
    if (sponsor_image_url) {
      query += ", sponsor_image = ?";
      params.push(sponsor_image_url);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await db.execute(query, params) as any;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post updated successfully" });
  } catch (error: any) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Failed to update post: " + error.message });
  }
});

app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    
    const [result] = await db.execute("DELETE FROM posts WHERE id = ?", [id]) as any;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Post not found or already deleted" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

// --- API Routes (PHP Aliases for Local Preview) ---
app.get("/api/posts.php", async (req, res) => {
  const category = req.query.category;
  const featured = req.query.featured;
  const search = req.query.search;
  let query = "SELECT * FROM posts";
  const params: any[] = [];
  const conditions: string[] = [];

  if (category) {
    conditions.push("category = ?");
    params.push(category);
  }
  if (featured) {
    conditions.push("is_featured = 1");
  }
  if (search) {
    conditions.push("(title LIKE ? OR content LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY created_at DESC";
  const [posts] = await db.execute(query, params);
  res.json(posts);
});

app.post("/api/posts.php", async (req, res) => {
  const { id, type } = req.body;
  if (id && ["like", "share", "click"].includes(type)) {
    const column = type + "s";
    await db.execute(`UPDATE posts SET ${column} = ${column} + 1 WHERE id = ?`, [id]);
    res.json({ success: true });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
});

app.get("/api/admin.php", async (req, res) => {
  const action = req.query.action;
  if (action === "stats") {
    const [posts] = await db.execute(`
      SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count 
      FROM posts p 
      ORDER BY p.created_at DESC
    `);
    
    const [statsRows] = await db.execute(`
      SELECT 
        SUM(views) as total_views, 
        SUM(likes) as total_likes, 
        SUM(shares) as total_shares, 
        SUM(clicks) as total_clicks,
        (SELECT COUNT(*) FROM comments) as total_comments
      FROM posts
    `) as any[];
    const totalStats = statsRows[0];

    res.json({ posts, totalStats });
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
});

app.post("/api/admin.php", async (req, res) => {
  const action = req.query.action;
  if (action === "login") {
    const { username, password } = req.body;
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]) as any[];
    const user = rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = password === user.password || bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token });
  } else {
    res.status(400).json({ message: "Invalid action" });
  }
});

app.post("/api/manage_posts.php", authenticateToken, upload.fields([{ name: "image", maxCount: 1 }, { name: "sponsor_image", maxCount: 1 }]), async (req: any, res) => {
  try {
    const { id, title, content, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, external_link } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let image_url = undefined;
    if (req.files?.image) {
      image_url = await uploadToCloudinary(req.files.image[0]);
    }

    let sponsor_image_url = undefined;
    if (req.files?.sponsor_image) {
      sponsor_image_url = await uploadToCloudinary(req.files.sponsor_image[0]);
    }

    if (id) {
      // Update
      let query = "UPDATE posts SET title = ?, content = ?, category = ?, is_featured = ?, tags = ?, seo_title = ?, seo_description = ?, sponsor_name = ?, sponsor_link = ?, external_link = ?";
      const params = [title, content, category, is_featured === "true" ? 1 : 0, tags, seo_title, seo_description, sponsor_name, sponsor_link, external_link];
      if (image_url) { query += ", image_url = ?"; params.push(image_url); }
      if (sponsor_image_url) { query += ", sponsor_image = ?"; params.push(sponsor_image_url); }
      query += " WHERE id = ?";
      params.push(id);
      await db.execute(query, params);
      res.json({ message: "Post updated successfully" });
    } else {
      // Create
      const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Date.now();
      const [result] = await db.execute(
        "INSERT INTO posts (title, slug, content, image_url, category, is_featured, tags, seo_title, seo_description, sponsor_name, sponsor_link, sponsor_image, external_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title, slug, content, image_url || "", category, is_featured === "true" ? 1 : 0,
          tags, seo_title, seo_description, sponsor_name, sponsor_link, sponsor_image_url || "", external_link
        ]
      ) as any;
      res.json({ id: result.insertId, slug });
    }
  } catch (error: any) {
    console.error("Manage post error:", error);
    res.status(500).json({ message: "Failed to manage post: " + error.message });
  }
});

app.delete("/api/manage_posts.php", authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.query.id as string);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });
    await db.execute("DELETE FROM posts WHERE id = ?", [id]);
    res.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

app.get("/api/comments.php", async (req, res) => {
  const post_id = req.query.post_id;
  if (!post_id) return res.json([]);
  const [comments] = await db.execute("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC", [post_id]);
  res.json(comments);
});

app.post("/api/comments.php", async (req, res) => {
  const { post_id, author_name, content } = req.body;
  if (!post_id || !author_name || !content) return res.status(400).json({ message: "Missing fields" });
  const [result] = await db.execute("INSERT INTO comments (post_id, author_name, content) VALUES (?, ?, ?)", [post_id, author_name, content]) as any;
  res.json({ id: result.insertId });
});

// --- End PHP Aliases ---

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Start the server (Hostinger Node.js environment)
if (process.env.NODE_ENV === "production" || process.env.HOSTINGER) {
  startServer();
} else if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  startServer();
}

export default app;
