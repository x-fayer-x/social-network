package models

type Privacy struct {
	Type   string `json:"type,omitempty"`
	PostID int    `json:"post_id,omitempty"`
	UserID []int  `json:"user_ids,omitempty"`
}
