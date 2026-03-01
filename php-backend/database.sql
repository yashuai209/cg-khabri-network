-- Database Schema for CG Khabri Network
-- Import this into your Hostinger MySQL Database

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50),
    is_featured TINYINT(1) DEFAULT 0,
    tags TEXT,
    seo_title TEXT,
    seo_description TEXT,
    sponsor_name VARCHAR(255),
    sponsor_link TEXT,
    sponsor_image VARCHAR(255),
    external_link TEXT,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    author_name VARCHAR(100),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Default Admin (Username: yashwant123, Password: yashwant123)
INSERT INTO users (username, password) VALUES ('yashwant123', 'yashwant123'); 
