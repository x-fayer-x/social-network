package Query

import (
	"database/sql"
	"fmt"

	models "Social-network/Database/Models"
)

func UserFollow(db *sql.DB, UserUUID string, UserFollow *[]models.User) error {
	stmt, err := db.Prepare(`SELECT follows.followed_uuid, COALESCE(users.nickname, users.first_name | ' ' | users.last_name) AS Name
    FROM follows 
    INNER JOIN users ON follows.followed_uuid = users.uuid
    WHERE following_uuid= ? AND pending = 1`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(UserUUID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var follow models.User

		err := rows.Scan(&follow.UUID, &follow.Name)
		if err != nil {
			return err
		}
		*UserFollow = append(*UserFollow, follow)
	}
	return nil
}

func GetFollowers(db *sql.DB, UserUUID string, UserFollower *[]models.User) error {
	// fmt.Println("user uuid", UserUUID)
	stmt, err := db.Prepare(`SELECT follows.following_uuid, COALESCE(users.nickname, users.first_name | ' ' | users.last_name) AS Name
    FROM follows 
    INNER JOIN users ON follows.following_uuid = users.uuid
    WHERE followed_uuid= ? AND pending = 1`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(UserUUID)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		var follower models.User

		err := rows.Scan(&follower.UUID, &follower.Name)
		if err != nil {
			return err
		}
		*UserFollower = append(*UserFollower, follower)
	}
	return nil
}

func AddFollower(db *sql.DB, UserFollowerUUID string, UserFollowUUID string, pending *int) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var user models.User
	if err := GetUserByUUID(db, UserFollowUUID, &user); err != nil {
		return err
	}

	// var query string
	// if user.Private {
	// 	*pending = 0
	// 	query = `INSERT INTO follows (following_uuid, followed_uuid, pending) VALUES (?, ?, 0)`
	// } else {
	// 	*pending = 1
	// }

	query := `INSERT INTO follows (following_uuid, followed_uuid, pending) VALUES (?, ?, ?)`

	stmt, err := tx.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(UserFollowerUUID, UserFollowUUID, pending)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func RemoveFollower(db *sql.DB, UserFollowerUUID string, UserFollowUUID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`DELETE FROM follows WHERE following_uuid = ? AND followed_uuid = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(UserFollowerUUID, UserFollowUUID)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func UpdateFollower(db *sql.DB, UserFollowerUUID string, UserFollowUUID string, pending *int) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `UPDATE follows SET pending = ? WHERE followed_uuid = ? AND following_uuid = ?`

	stmt, err := tx.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(pending, UserFollowUUID, UserFollowerUUID)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func GetPending(db *sql.DB, requestUserUUID, UserUUID string, pending *int) error {
	stmt, err := db.Prepare(`SELECT pending FROM follows WHERE followed_uuid = ? AND following_uuid = ?`)
	if err != nil {
		fmt.Println("error in GetPending uhbfeihb: ", err)
		return err
	}
	defer stmt.Close()

	err = stmt.QueryRow(UserUUID, requestUserUUID).Scan(pending)
	if err != nil {
		fmt.Println("error in GetPending : ", err)
		return err
	}

	fmt.Println("pending", *pending)

	return nil
}

// func AcceptFollowRequest(db *sql.DB, UserFollowerUUID string, UserFollowUUID string) error {
// }

func IsFollowing(db *sql.DB, UserFollowerUUID string, UserFollowUUID string) (int, error) {
	stmt, err := db.Prepare(`SELECT pending FROM follows WHERE following_uuid = ? AND followed_uuid = ?`)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	var pending int
	err = stmt.QueryRow(UserFollowerUUID, UserFollowUUID).Scan(&pending)
	if err != nil {
		return 0, err
	}

	return pending, nil
}
