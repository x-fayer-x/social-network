package models

type Groups struct {
	ID           int    `json:"id,omitempty"`
	CreatorUUID  string `json:"creator_uuid,omitempty"`
	Title        string `json:"title,omitempty"`
	Description  string `json:"description,omitempty"`
	CreationDate string
}
