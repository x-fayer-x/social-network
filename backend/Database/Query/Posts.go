package Query

import (
	"database/sql"
	"fmt"

	models "Social-network/Database/Models"
)

// function to add post to database
func AddPost(db *sql.DB, post *models.Post) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO posts (user_uuid, body, group_id, status, created_at) VALUES (?,?,?,?,?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(post.UserUUID, post.Body, post.Group, post.Privacy, post.CreationDate)
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	post.ID = int(id)
	if len(post.ViewerList) > 1 {
		if err := SetPrivacy(db, post); err != nil {
			fmt.Println("error in set privacy", err)
			return err
		}
	}

	return nil
}

// function to delete post from database
func DeletePost(db *sql.DB, post models.Post) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`DELETE FROM posts WHERE id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(post.ID)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// function to get one post from database
func GetOnePost(db *sql.DB, PostID string, post *models.Post) error {
	stmt, err := db.Prepare(`SELECT posts.*, COALESCE(users.nickname,users.first_name || ' ' || users.last_name) AS Name
	FROM posts
	INNER JOIN users ON posts.user_uuid = users.uuid
	WHERE posts.id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	err = stmt.QueryRow(PostID).Scan(&post.ID, &post.UserUUID, &post.Group, &post.Body, &post.Privacy, &post.CreationDate, &post.Name)
	if err != nil {
		return err
	}

	return nil
}

// function to get all posts of a user from database
func GetPostUser(db *sql.DB, targetUserUUID, requestUserUUID string, postList *[]models.Post) error {
	stmt, err := db.Prepare(`SELECT posts.*, COALESCE(users.nickname, users.first_name || ' ' || users.last_name) AS display_name, users.img_path
							FROM posts
							JOIN users ON posts.user_uuid = users.uuid
							WHERE posts.user_uuid = ? AND posts.status = 'public'
							
							UNION
							
							SELECT posts.*, COALESCE(users.nickname, users.first_name || ' ' || users.last_name) AS display_name, users.img_path
							FROM posts
							JOIN users ON posts.user_uuid = users.uuid
							WHERE posts.user_uuid = ? AND posts.status = 'private' AND EXISTS (
								SELECT 1 FROM follows
								WHERE followed_uuid = ? AND following_uuid = ?
							)
							
							UNION
							
							SELECT posts.*, COALESCE(users.nickname, users.first_name || ' ' || users.last_name) AS display_name, users.img_path
							FROM posts
							JOIN users ON posts.user_uuid = users.uuid
							JOIN privacy ON posts.id = privacy.post_id
							WHERE posts.user_uuid = ? AND posts.status = 'almost private' AND privacy.user_uuid = ?

							UNION
							SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, users.img_path
							FROM posts
							INNER JOIN users ON posts.user_uuid = users.uuid
							WHERE posts.user_uuid = ? AND posts.status = 'private';
							ORDER BY posts.created_at DESC`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(targetUserUUID, targetUserUUID, targetUserUUID, requestUserUUID, targetUserUUID, requestUserUUID, targetUserUUID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		var temp, status string

		if err := rows.Scan(&post.ID, &post.UserUUID, &temp, &post.Body, &status, &post.CreationDate, &post.Privacy, &post.Name, &post.Avatar); err != nil {
			return err
		}
		*postList = append(*postList, post)
	}

	return nil
}

func GetPost(db *sql.DB, requestUserUUID string, postList *[]models.Post) error {
	stmt, err := db.Prepare(`SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, users.img_path
                            FROM posts
                            INNER JOIN users ON posts.user_uuid = users.uuid
                            WHERE posts.status = 'public'
                            UNION
                            SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, users.img_path
                            FROM posts
                            INNER JOIN users ON posts.user_uuid = users.uuid
                            WHERE posts.status = 'private' AND EXISTS (
                            SELECT 1 FROM follows
                            WHERE follows.followed_uuid = posts.user_uuid AND follows.following_uuid = ?
                            )
                            UNION
                            SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, users.img_path
                            FROM posts
                            INNER JOIN users ON posts.user_uuid = users.uuid
                            INNER JOIN privacy ON posts.id = privacy.post_id
                            WHERE posts.status = 'almost private' AND privacy.user_uuid = ?
							UNION
							SELECT posts.*, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, users.img_path
							FROM posts
							INNER JOIN users ON posts.user_uuid = users.uuid
							WHERE posts.user_uuid = ? AND posts.status = 'private'
                            ORDER BY posts.created_at DESC
							`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query(requestUserUUID, requestUserUUID, requestUserUUID)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		var status string
		var temp string
		if err := rows.Scan(&post.ID, &post.UserUUID, &temp, &post.Body, &status, &post.CreationDate, &post.Privacy, &post.Name, &post.Avatar); err != nil {
			return err
		}
		*postList = append(*postList, post)
	}

	return nil
}
