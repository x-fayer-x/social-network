CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_uuid VARCHAR(60) NOT NULL,
    username VARCHAR(60) NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    img_path TEXT,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_uuid) REFERENCES  users(uuid) ON DELETE CASCADE
);