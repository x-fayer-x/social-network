CREATE TABLE IF NOT EXISTS chat_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender VARCHAR(60) NOT NULL,
    group_target INTEGER NOT NULL,
    message_content TEXT NOT NULL,
    send_at TEXT NOT NULL,
    img_path TEXT NOT NULL,
    FOREIGN KEY (sender) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (group_target) REFERENCES groups(id) ON DELETE CASCADE
);