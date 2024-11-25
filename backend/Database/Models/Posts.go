package models

type Post struct {
	ID           int    `json:"id,omitempty"`
	UserUUID     string `json:"user_uuid,omitempty"`
	Name         string
	Avatar       string
	Privacy      string   `json:"privacy,omitempty"`
	Group        int      `json:"group,omitempty"`
	Body         string   `json:"body,omitempty"`
	CreationDate string   `json:"creation_date,omitempty"`
	ImgPath      string   `json:"img_path,omitempty"`
	ViewerList   []string `json:"viewerList,omitempty"`
}
