package models

type ChatGroups struct {
	ID             int    `json:"id"`
	SenderUUID     string `json:"sender_uuid"`
	TargetID       int    `json:"target_id"`
	MessageContent string `json:"message_content"`
	SendAt         string `json:"send_at"`
	ImgPath        string `json:"img_path"`
	Type           string `json:"type"`
}
