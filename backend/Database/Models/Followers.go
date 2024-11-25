package models

type Followers struct {
	FollowedUserID int    `json:"followed_user_id,omitempty"`
	FollowerUserID int    `json:"follower_user_id,omitempty"`
	FollowingDate  string `json:"following_date,omitempty"`
	FollowPending  int    `json:"follow_pending,omitempty"`
}
