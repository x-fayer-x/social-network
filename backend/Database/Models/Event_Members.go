package models

type EventMembers struct {
	ID       int    `json:"id"`
	Choice   int `json:"choice"`
	UserUUID string `json:"user_uuid"`
	EventID  int    `json:"event_id"`
}
