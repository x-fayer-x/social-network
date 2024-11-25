package Query

import (
	"database/sql"
	"fmt"
	"time"

	models "Social-network/Database/Models"
)

func GetCommentsByPostID(db *sql.DB, postID string, comments *[]models.Comment) error {
	stmt, err := db.Prepare(`SELECT * FROM comments WHERE post_id = ? ORDER BY comments.created_at DESC`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(postID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment models.Comment
		err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserUUID, &comment.UserName, &comment.Body, &comment.CreationDate, &comment.ImgPath)
		if err != nil {
			return err
		}
		*comments = append(*comments, comment)
	}
	return nil
}

func CreateComment(db *sql.DB, comment *models.Comment) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT INTO comments (post_id, user_uuid, username, body, created_at, img_path) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		fmt.Println("error to prepare the query CreateComment : ", err)
		return err
	}
	defer stmt.Close()

	var user models.User
	err = GetUserByUUID(db, comment.UserUUID, &user)
	if err != nil {
		return err
	}
	comment.UserName = user.Nickname

	comment.CreationDate = time.Now().Format("2006-01-02 15:04:05")

	res, err := stmt.Exec(comment.PostID, comment.UserUUID, comment.UserName, comment.Body, comment.CreationDate, comment.ImgPath)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return err
	}
	comment.ID = int(id)

	return nil
}
