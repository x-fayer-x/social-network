package Query

import (
	"database/sql"
	"time"

	models "Social-network/Database/Models"
)

// function to add notification
func AddNotification(db *sql.DB, notification *models.Notification) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO notifications (type, content, senderUUID, receiverUUID, at, seen, targetid) VALUES (?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var user models.User
	if err := GetUserByUUID(db, notification.SenderUUID, &user); err != nil {
		return err
	}
	var completeNotifContent string
	if user.Nickname == "" {
		completeNotifContent = user.Firstname + " " + user.Lastname
	} else {
		completeNotifContent = user.Nickname
	}

	completeNotifContent = completeNotifContent + " " + notification.Content

	notification.Content = completeNotifContent

	notification.At = time.Now().Format("2006-01-02 15:04:05")

	_, err = stmt.Exec(notification.Type, completeNotifContent, notification.SenderUUID, notification.ReceiverUUID, notification.At, notification.Read, notification.TargetID)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// function to get all notifications of a user
func GetNotification(db *sql.DB, UserUUID string, notifications *[]models.Notification) error {
	stmt, err := db.Prepare(`SELECT * FROM notifications WHERE receiverUUID = ? ORDER BY at DESC`)
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
		var notification models.Notification
		if err := rows.Scan(&notification.Id, &notification.Type, &notification.Content, &notification.SenderUUID, &notification.ReceiverUUID, &notification.At, &notification.Read, &notification.TargetID); err != nil {
			return err
		}
		*notifications = append(*notifications, notification)
	}
	return nil
}

func UpdateSeen(db *sql.DB, seen string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE notifications SET seen = 1 WHERE receiverUUID = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(seen)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
