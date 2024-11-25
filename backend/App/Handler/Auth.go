package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"Social-network/App/utils"

	m "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// Decode request body
	user := m.User{}
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalide request body", http.StatusBadRequest)
		return
	}

	// complete missing or invalid fields
	utils.GenerateUUID(&user.UUID)
	utils.EncryptPassword(&user.Password)

	// creation of user
	err = Query.CreateUser(db.(*sql.DB), &user)
	if err != nil {
		http.Error(w, "error to create user", http.StatusBadRequest)
		return
	}

	if Query.SessionExists(db.(*sql.DB), user.UUID) {
		Query.ClearSession(db.(*sql.DB), "", user.UUID)
	}

	var uuid string
	err = Query.CreateSession(db.(*sql.DB), &user, &uuid)
	if err != nil {
		return
	}

	// creation of response
	SafeUser := map[string]interface{}{
		"name":        user.Firstname + " " + user.Lastname,
		"email":       user.Email,
		"birthdate":   user.Birthdate,
		"description": user.Aboutme,
		"uuid":        user.UUID,
		"token":       uuid,
		"Avatar":      user.Profilepicture,
	}

	// ConnectedUsers[u.UUID] = make(map[string]*websocket.Conn)
	// send response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SafeUser)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	l := m.Login{}
	err := json.NewDecoder(r.Body).Decode(&l)
	if err != nil {
		http.Error(w, "Invalide request body", http.StatusBadRequest)
		return
	}

	// Check Credentials
	user, err := Query.GetUser(db.(*sql.DB), l)
	if err != nil {

		if err.Error() == "user not found" {

			http.Error(w, "User not found", http.StatusNotFound)
			return

		} else if err.Error() == "invalid password" {

			http.Error(w, "Invalid password", http.StatusUnauthorized)
			return
		}
		return
	}

	if Query.SessionExists(db.(*sql.DB), user.UUID) {
		Query.ClearSession(db.(*sql.DB), "", user.UUID)
	}

	var uuid string
	err = Query.CreateSession(db.(*sql.DB), &user, &uuid)
	if err != nil {
		fmt.Println("error", err)
		return
	}

	SafeUser := map[string]interface{}{
		"name":        user.Firstname + " " + user.Lastname,
		"email":       user.Email,
		"birthdate":   user.Birthdate,
		"description": user.Aboutme,
		"uuid":        user.UUID,
		"nickname":    user.Nickname,
		"token":       uuid,
		"Avatar":      user.Profilepicture,
		"private":     user.Private,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SafeUser)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	Session := m.Session{}
	err := json.NewDecoder(r.Body).Decode(&Session)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("Invalid request body " + err.Error()))
		return
	}

	// clear session in db
	err = Query.ClearSession(db.(*sql.DB), Session.Token, "")
	if err != nil {
		fmt.Println("error", err)
		http.Error(w, "No session found", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("Session cleared")
}
