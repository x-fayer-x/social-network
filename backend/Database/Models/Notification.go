package models

type Notification struct {
	Id           int
	Type         string `json:"type"`
	Content      string `json:"content"`
	SenderUUID   string `json:"sender_uuid"`
	ReceiverUUID string `json:"receiver_uuid"`
	At           string `json:"at"`
	Read         int    `json:"read"`
	TargetID     int    `json:"target_id"`
}
