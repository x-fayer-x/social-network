package models

type Events struct {
	ID          int    `json:"id"`
	GroupID     int    `json:"group_id"`
	CreatorUUID string `json:"creator_uuid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	EventDate   string `json:"event_date"`
	Location    string `json:"location"`
	GroupeTitle string `json:"group_title"`
	ImgPath     string `json:"img_path"`
	Choice      int    `json:"choice"`
}
