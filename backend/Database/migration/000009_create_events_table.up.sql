CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    creator_uuid VARCHAR(60) NOT NULL,
    title VARCHAR(35) NOT NULL,
    description TEXT NOT NULL,
    event_date TEXT NOT NULL,
    location TEXT NOT NULL,
    img_path TEXT DEFAULT "", 
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);