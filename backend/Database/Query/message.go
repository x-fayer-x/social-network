package Query

import (
	"database/sql"
	"fmt"
	"time"

	models "Social-network/Database/Models"
)

func GetConvMessage(db *sql.DB, Sender, Recever string, messageList *[]models.ChatUsers) error {
	stmt, err := db.Prepare(`SELECT 
        chat_users.sender, 
        chat_users.target, 
        chat_users.message_content, 
        chat_users.send_at, 
        COALESCE(sender.nickname, sender.first_name || ' ' || sender.last_name) AS sender_name,
        COALESCE(target.nickname, target.first_name || ' ' || target.last_name) AS target_name
    FROM 
        chat_users
    INNER JOIN 
        users AS sender ON sender.uuid = chat_users.sender
    INNER JOIN 
        users AS target ON target.uuid = chat_users.target
    WHERE 
        chat_users.sender = ? AND chat_users.target = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(Sender, Recever)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var message models.ChatUsers
		if err := rows.Scan(&message.SenderUUID, &message.TargetUUID, &message.MessageContent, &message.SendAt, &message.SenderName, &message.TargetName); err != nil {
			return err
		}

		*messageList = append(*messageList, message)
	}

	return nil
}

func GetConvGroupMessage(db *sql.DB, Sender, Recever string, messageList *[]models.ChatUsers) error {
	stmt, err := db.Prepare(`SELECT 
        chat_group.sender, 
        chat_group.group_target, 
        chat_group.message_content, 
        chat_group.send_at, 
        COALESCE(sender.nickname, sender.first_name || ' ' || sender.last_name) AS sender_name
    FROM 
        chat_group
    INNER JOIN 
        users AS sender ON sender.uuid = chat_group.sender
    WHERE 
        chat_group.sender = ? AND chat_group.group_target = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(Sender, Recever)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var message models.ChatUsers
		if err := rows.Scan(&message.SenderUUID, &message.TargetUUID, &message.MessageContent, &message.SendAt, &message.SenderName, &message.TargetName); err != nil {
			return err
		}

		*messageList = append(*messageList, message)
	}

	return nil
}

func AddGroupMessage(db *sql.DB, message *models.ChatGroups) error {
	stmt, err := db.Prepare(`INSERT INTO chat_group (sender, group_target, message_content, send_at, img_path) VALUES (?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	message.SendAt = time.Now().Format("2006-01-02 15:04:05")

	_, err = stmt.Exec(message.SenderUUID, message.TargetID, message.MessageContent, message.SendAt, message.ImgPath)
	if err != nil {
		return err
	}

	return nil
}

func GetMessagesByGroupId(db *sql.DB, group_id string, messages *[]models.ChatGroups) error {
	stmt, err := db.Prepare("SELECT * FROM chat_group WHERE group_target = $1")
	if err != nil {
		return err
	}
	defer stmt.Close()

	fmt.Println("group_id : ", group_id)

	rows, err := stmt.Query(group_id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var message models.ChatGroups
		if err := rows.Scan(&message.ID, &message.SenderUUID, &message.TargetID, &message.MessageContent, &message.SendAt, &message.ImgPath); err != nil {
			return err
		}
		*messages = append(*messages, message)
	}
	return nil
}

func GetMessagesByUserUUID(db *sql.DB, sender, target string, messages *[]models.ChatUsers) error {
	stmt, err := db.Prepare("SELECT * FROM chat_users WHERE sender = $1 AND target = $2 OR sender = $2 AND target = $1")
	if err != nil {
		fmt.Println("error to prepare query : ", err)
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(sender, target)
	if err != nil {
		fmt.Println("error to get messages : ", err)
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var message models.ChatUsers
		if err := rows.Scan(&message.ID, &message.SenderUUID, &message.TargetUUID, &message.MessageContent, &message.SendAt, &message.ImgPath); err != nil {
			return err
		}
		*messages = append(*messages, message)
	}
	return nil
}

func AddUserMessage(db *sql.DB, message *models.ChatUsers) error {
	stmt, err := db.Prepare("INSERT INTO chat_users (sender, target, message_content, send_at, img_path) VALUES ($1, $2, $3, $4, $5)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	message.SendAt = time.Now().Format("2006-01-02 15:04:05")

	_, err = stmt.Exec(message.SenderUUID, message.TargetUUID, message.MessageContent, message.SendAt, message.ImgPath)
	if err != nil {
		return err
	}

	return nil
}
