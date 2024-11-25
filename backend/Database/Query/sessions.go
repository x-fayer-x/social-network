package Query

import (
	"database/sql"
	"fmt"
	"time"

	"Social-network/Database"
	models "Social-network/Database/Models"

	"github.com/gofrs/uuid"
)

// function to add a new session in database
func CreateSession(db *sql.DB, user *models.User, SessionUUID *string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO sessions (user_uuid, session_token, expiration_date) VALUES (?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	uuid, _ := uuid.NewV4()
	expirationDate := time.Now().Add(time.Hour * 1).Format("2006-01-02 15:04:05")

	_, err = stmt.Exec(user.UUID, uuid, expirationDate)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	*SessionUUID = uuid.String()

	return nil
}

// function to delete session from database
func ClearSession(db *sql.DB, SessionToken string, user_uuid string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	fmt.Println("SessionToken", SessionToken)

	stmt, err := tx.Prepare(`DELETE FROM sessions WHERE session_token = ? OR user_uuid = ?`)
	if err != nil {
		fmt.Println("error in prepare delete session", err)
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(SessionToken, user_uuid)
	if err != nil {
		fmt.Println("error", err)
		return err
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println("error in commit delete session", err)
		return err
	}
	fmt.Println("res", res)

	return nil
}

// function to check if session is valid
func CheckSession(sessionToken string) error {
	DB, err := Database.ConnectDB()
	if err != nil {
		return err
	}

	stmt, err := DB.DB.Prepare(`SELECT session_token FROM sessions WHERE session_token = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(sessionToken)
	if err != nil {
		return err
	}
	rows.Close()

	var token string
	for rows.Next() {
		if err := rows.Scan(&token); err != nil {
			return err
		}
	}

	if token == "" {
		return err
	}
	return nil
}

func SessionExists(db *sql.DB, uuid string) bool {
	stmt, err := db.Prepare(`SELECT COUNT(*) FROM sessions WHERE user_uuid = ?`)
	if err != nil {
		return false
	}

	if err != nil {
		return false
	}

	var count int
	err = stmt.QueryRow(uuid).Scan(&count)
	if err != nil {
		fmt.Println("error in scan session", err)
		return false
	}

	fmt.Println("count: ", count)

	if count == 0 {
		return false
	}
	return true
}
