package Database

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

type DB struct {
	DB *sql.DB
}

func ConnectDB() (DB, error) {
	db, err := sql.Open("sqlite3", "./social-network.db")
	if err != nil {
		panic(err)
	}
	return DB{DB: db}, nil
}

func UseMigration(db DB) error {
	driver, err := sqlite3.WithInstance(db.DB, &sqlite3.Config{})
	if err != nil {
		log.Fatalf("Failure to start migration: %v", err)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file:///root/Database/migration",
		"sqlite",
		driver,
	)
	if err != nil {
		log.Fatalf("migration failed: %v", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("An error occurred while syncing the database: %v", err)
	}
	return nil
}
