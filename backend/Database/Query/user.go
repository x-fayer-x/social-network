package Query

import (
	"database/sql"
	"errors"
	"fmt"

	models "Social-network/Database/Models"

	"golang.org/x/crypto/bcrypt"
)

// function to get a user if his credential are correct
func GetUser(db *sql.DB, l models.Login) (models.User, error) {
	var user models.User

	stmt, err := db.Prepare("SELECT uuid, email, password, private, first_name, last_name, birth_date, COALESCE(nickname, '') AS nickname, COALESCE(about_me,'') AS about_me, COALESCE(img_path,'') AS img_path FROM users WHERE email = ?")
	if err != nil {

		return user, errors.New("error preparing query")
	}

	err = stmt.QueryRow(l.Email).Scan(&user.UUID, &user.Email, &user.Password, &user.Private, &user.Firstname, &user.Lastname, &user.Birthdate, &user.Nickname, &user.Aboutme, &user.Profilepicture)
	if err != nil {
		if err == sql.ErrNoRows {
			return user, errors.New("user not found")
		}
		return models.User{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(l.Password))
	if err != nil {
		return models.User{}, errors.New("invalid password")
	}

	return user, nil
}

// function to create a new user
func CreateUser(db *sql.DB, u *models.User) error {
	// var opt string

	stmt, err := db.Prepare("INSERT INTO users (uuid, email, password, first_name, last_name, birth_date, nickname, about_me) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		fmt.Println("error preparing query", err)
		return errors.New("error preparing query")
	}

	_, err = stmt.Exec(u.UUID, u.Email, u.Password, u.Firstname, u.Lastname, u.Birthdate, u.Nickname, u.Aboutme)
	if err != nil {
		fmt.Println("error executing query", err)
		return errors.New("error executing query")
	}
	return nil
}

// function to get uuid of user by his Session_token
func GetUserUUID(db *sql.DB, SessionToken string) string {
	// fmt.Println("SessionToken : ", SessionToken)
	stmt, err := db.Prepare("SELECT user_uuid FROM sessions WHERE session_token = ?")
	if err != nil {
		return ""
	}
	var UserUUID string
	err = stmt.QueryRow(SessionToken).Scan(&UserUUID)
	if err != nil {
		return ""
	}
	return UserUUID
}

// function to get user by his uuid
func GetUserByUUID(db *sql.DB, UUID string, user *models.User) error {
	stmt, err := db.Prepare("SELECT uuid, email, private, first_name, last_name, birth_date, COALESCE(NULLIF(users.nickname, ''), users.first_name || ' ' || users.last_name) AS user_name, COALESCE(about_me,'') AS about_me, COALESCE(img_path,'') AS img_path FROM users WHERE uuid = ?")
	if err != nil {
		fmt.Println(err)
		return errors.New("error preparing query")
	}

	err = stmt.QueryRow(UUID).Scan(&user.UUID, &user.Email, &user.Private, &user.Firstname, &user.Lastname, &user.Birthdate, &user.Nickname, &user.Aboutme, &user.Profilepicture)
	if err != nil {
		fmt.Println("error", err)
		if err == sql.ErrNoRows {
			return errors.New("user not found")
		}
		return err
	}
	return nil
}
