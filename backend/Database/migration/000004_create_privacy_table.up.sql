CREATE TABLE IF NOT EXISTS privacy (
    post_id INTEGER NOT NULL,
    user_uuid VARCHAR(60),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);