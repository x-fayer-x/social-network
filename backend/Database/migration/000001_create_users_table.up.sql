CREATE TABLE IF NOT EXISTS users
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid       VARCHAR(60)  NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(60)  NOT NULL,
    private    INTEGER NOT NULL DEFAULT 0,
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    birth_date text         NOT NULL,
    nickname   VARCHAR(25) NOT NULL UNIQUE,
    about_me   text NOT NULL,
    img_path   text NOT NULL DEFAULT ''
);