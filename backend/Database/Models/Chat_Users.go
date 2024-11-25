package models

type ChatUsers struct {
	ID             int    `json:"id"`
	SenderUUID     string `json:"sender_uuid"`
	SenderName     string
	TargetUUID     string `json:"target_uuid"`
	TargetName     string
	MessageContent string `json:"message_content"`
	SendAt         string `json:"send_at"`
	ImgPath        string `json:"img_path"`
	Type           string `json:"type"`
}
