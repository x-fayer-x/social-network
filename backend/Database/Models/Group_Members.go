package models

type GroupMembers struct {
	ID       int `json:"id"`
	GroupID  int `json:"group_id"`
	Name     string
	UserUuid string `json:"user_uuid"`
	Pending  int    `json:"pending"`
}
