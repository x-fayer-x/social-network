package models

type User struct {
	Id             int
	UUID           string `json:"uuid"`
	Email          string `json:"email"`
	Password       string `json:"password"`
	Private        bool
	Firstname      string `json:"fName"`
	Lastname       string `json:"lName"`
	Birthdate      string `json:"birthdate"`
	Profilepicture string
	Nickname       string `json:"nName"`
	Aboutme        string `json:"description"`

	Name string
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
