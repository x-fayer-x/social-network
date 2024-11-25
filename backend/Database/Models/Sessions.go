package models

type Session struct {
	UserUUID      string `json:"user_id,omitempty"`
	InteractToken string `json:"interact_token,omitempty"`
	Token         string `json:"token"`
	Creationdate  string `json:"creation_date,omitempty"`
}
