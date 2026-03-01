import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hybrid Database Helper
class DB {
  private mysqlPool: any = null;
  private sqlite: any = null;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production' || !!process.env.DB_HOST;
    
    if (this.isProduction) {
      this.mysqlPool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
      });
    } else {
      const dbPath = path.resolve(__dirname, '../../news.db');
      this.sqlite = new Database(dbPath);
      this.initSqlite();
    }
  }

  private initSqlite() {
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT);
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, slug TEXT UNIQUE, content TEXT, image_url TEXT, category TEXT, is_featured INTEGER DEFAULT 0,
        tags TEXT, seo_title TEXT, seo_description TEXT, sponsor_name TEXT, sponsor_link TEXT, sponsor_image TEXT, external_link TEXT,
        views INTEGER DEFAULT 0, likes INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, author_name TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Add dummy admin if not exists
      INSERT OR IGNORE INTO users (username, password) VALUES ('admin', 'admin123');

      -- Add dummy posts if table is empty
      INSERT INTO posts (title, slug, content, category, is_featured, created_at)
      SELECT 'Chhattisgarh State News Update', 'state-news-update', 'This is a sample news story for Chhattisgarh state.', 'State', 1, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (SELECT 1 FROM posts);

      INSERT INTO posts (title, slug, content, category, is_featured, created_at)
      SELECT 'National News Highlights', 'national-news-highlights', 'This is a sample news story for National news.', 'National', 0, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'national-news-highlights');

      INSERT INTO posts (title, slug, content, category, is_featured, created_at)
      SELECT 'Sports News Today', 'sports-news-today', 'This is a sample news story for Sports news.', 'Sports', 0, CURRENT_TIMESTAMP
      WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'sports-news-today');
    `);
  }

  async execute(query: string, params: any[] = []) {
    if (this.isProduction) {
      return await this.mysqlPool.execute(query, params);
    } else {
      // Convert MySQL syntax to SQLite if needed (very basic)
      const sqliteQuery = query.replace(/NOW\(\)/g, "CURRENT_TIMESTAMP").replace(/DATE_SUB\(.*?\)/g, "date('now', '-2 days')");
      const stmt = this.sqlite.prepare(sqliteQuery);
      if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return [rows];
      } else {
        const result = stmt.run(...params);
        return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }];
      }
    }
  }
}

const db = new DB();
export default db;
