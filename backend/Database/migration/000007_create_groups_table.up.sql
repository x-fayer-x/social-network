CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_uuid VARCHAR(60) NOT NULL,
    title VARCHAR(35) NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (creator_uuid) REFERENCES users(id) ON DELETE CASCADE
);