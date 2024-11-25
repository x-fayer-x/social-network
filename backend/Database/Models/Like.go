package models

type Like struct {
	ID        int    `json:"id"`
	PostID    int    `json:"post_id"`
	CommentID int    `json:"comment_id"`
	User_uuid string `json:"user_uuid"`
}
