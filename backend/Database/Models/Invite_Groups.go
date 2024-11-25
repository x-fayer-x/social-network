package models

type InviteGroups struct {
	ID         int    `json:"id"`
	GroupID    int    `json:"group_id"`
	TargetUUID string `json:"inviter_uuid"`
	Pending    int    `json:"pending"`
}
