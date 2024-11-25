CREATE TABLE IF NOT EXISTS chat_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender VARCHAR(60) NOT NULL,
    target VARCHAR(60) NOT NULL,
    message_content TEXT NOT NULL,
    send_at TEXT NOT NULL,
    img_path TEXT,
    FOREIGN KEY (sender) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (target) REFERENCES users(uuid) ON DELETE CASCADE
);