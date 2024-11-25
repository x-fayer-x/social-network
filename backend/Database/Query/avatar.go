package Query

import (
	"database/sql"
)

// Store that the user has an avatar
func StoreAvatar(db *sql.DB, UserUUID string, path string) error {
	stmt, err := db.Prepare("UPDATE users SET img_path = ? WHERE uuid = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(path, UserUUID)
	if err != nil {
		return err
	}
	return nil
}

// Delete that the user have an avatar
func DeleteUserAvatar(db *sql.DB, UserUUID string) error {
	stmt, err := db.Prepare("UPDATE users SET img_path = ? WHERE uuid = ?")
	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(0, UserUUID)
	if err != nil {
		return err
	}

	return nil
}

// Check if the user has an avatar
func IsAvatar(db *sql.DB, UserUUID string) (bool, error) {
	var avatar bool = false

	err := db.QueryRow("SELECT img_path FROM users WHERE uuid = ?", UserUUID).Scan(&avatar)
	if err != nil {
		return avatar, err
	}

	return avatar, nil
}
