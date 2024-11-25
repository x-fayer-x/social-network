package models

type Comment struct {
	ID           int    `json:"id,omitempty"`
	PostID       int    `json:"post_id,omitempty"`
	UserUUID     string `json:"user_id,omitempty"`
	UserName     string
	Body         string `json:"body,omitempty"`
	CreationDate string `json:"creation_date,omitempty"`
	ImgPath      string `json:"img_path,omitempty"`
}
