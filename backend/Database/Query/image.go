package Query

import (
	"database/sql"
	"fmt"
)

func StorePostImage(db *sql.DB, postID string, path string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE posts SET img_path = ? WHERE id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(path, postID); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func GetPostImagePath(db *sql.DB, PostID string) string {
	stmt, err := db.Prepare(`SELECT img_path FROM posts WHERE id = ?`)
	if err != nil {
		return ""
	}
	defer stmt.Close()

	var path string
	err = stmt.QueryRow(PostID).Scan(&path)
	if err != nil {
		fmt.Println("error", err)
		return ""
	}

	return path
}

func GetCommentImagePath(db *sql.DB, CommentID string) string {
	stmt, err := db.Prepare(`SELECT img_path FROM comments WHERE id = ?`)
	if err != nil {
		return ""
	}
	defer stmt.Close()

	var path string
	err = stmt.QueryRow(CommentID).Scan(&path)
	if err != nil {
		fmt.Println("error", err)
		return ""
	}

	return path
}

func StoreCommentImage(db *sql.DB, CommentID string, path string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE comments SET img_path = ? WHERE id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(path, CommentID); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func StoreMessageImage(db *sql.DB, MessageID string, path string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE chat_users SET img_path = ? WHERE id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(path, MessageID); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

func GetEventImagePath(db *sql.DB, EventID string) string {
	stmt, err := db.Prepare(`SELECT img_path FROM events WHERE id = ?`)
	if err != nil {
		return ""
	}
	defer stmt.Close()

	var path string
	err = stmt.QueryRow(EventID).Scan(&path)
	if err != nil {
		fmt.Println("error", err)
		return ""
	}

	return path
}

func StoreEventImage(db *sql.DB, EventID string, path string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE events SET img_path = ? WHERE id = ?`)
	if err != nil {
		fmt.Println("error in preparing event image update", err)
		return err
	}
	defer stmt.Close()

	if _, err := stmt.Exec(path, EventID); err != nil {
		fmt.Println("error in updating event image", err)
		return err
	}
	if err := tx.Commit(); err != nil {
		fmt.Println("error in committing event image update", err)
		return err
	}
	return nil
}
