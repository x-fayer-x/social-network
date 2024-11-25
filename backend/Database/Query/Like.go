package Query

import (
	"database/sql"

	models "Social-network/Database/Models"
)

func GetPostLike(db *sql.DB, postId int, likeList *[]models.Like) error {
	stmt, err := db.Prepare(`SELECT UserUUID FROM likes WHERE PostID = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(postId)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var like models.Like
		if err := rows.Scan(&like.User_uuid); err != nil {
			return err
		}
		*likeList = append(*likeList, like)
	}

	return nil
}

func GetCommentLike(db *sql.DB, commentId int, likeList *[]models.Like) error {
	stmt, err := db.Prepare(`SELECT UserUUID FROM likes WHERE CommentID = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(commentId)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var like models.Like
		if err := rows.Scan(&like.User_uuid); err != nil {
			return err
		}
		*likeList = append(*likeList, like)
	}
	return nil
}

func AddPostLike(db *sql.DB, like *models.Like) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO likes (PostID, UserUUID) VALUES (?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(like.PostID, like.User_uuid)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func AddCommentLike(db *sql.DB, like *models.Like) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO likes (CommentID, UserUUID) VALUES (?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(like.CommentID, like.User_uuid)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func DeletePostLike(db *sql.DB, like *models.Like) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`DELETE FROM likes WHERE PostID = ? AND UserUUID = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(like.PostID, like.User_uuid)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func DeleteCommentLike(db *sql.DB, like *models.Like) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`DELETE FROM likes WHERE CommentID = ? AND UserUUID = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(like.CommentID, like.User_uuid)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}
