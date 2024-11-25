CREATE TABLE IF NOT EXISTS follows (
    following_uuid VARCHAR(60),
    followed_uuid VARCHAR(60),
    create_at text,
    pending INTEGER DEFAULT 1,
    FOREIGN KEY (following_uuid) REFERENCES users(uuid) ON DELETE CASCADE,
    FOREIGN KEY (followed_uuid) REFERENCES  users(uuid) ON DELETE CASCADE
);