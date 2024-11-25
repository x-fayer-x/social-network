package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

// function handler to get user infos by uuid
func UserInfosHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	uuid := strings.Trim(r.PathValue("uuid"), "{}")

	var user models.User

	if err := Query.GetUserByUUID(db.(*sql.DB), uuid, &user); err != nil {
		http.Error(w, "error to get user", http.StatusBadRequest)
		return
	}

	requestUserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	// get the post from database
	var posts []models.Post
	if err := Query.GetPostUser(db.(*sql.DB), uuid, requestUserUUID, &posts); err != nil {
		http.Error(w, "error to get posts", http.StatusBadRequest)
		return
	}

	fmt.Println("posts", posts)

	// get followers
	var followers []models.User
	if err := Query.GetFollowers(db.(*sql.DB), uuid, &followers); err != nil {
		http.Error(w, "error to get followers", http.StatusBadRequest)
		return
	}

	// get following
	var following []models.User
	if err := Query.UserFollow(db.(*sql.DB), uuid, &following); err != nil {
		http.Error(w, "error to get following", http.StatusBadRequest)
		return
	}

	pending := -1
	if err := Query.GetPending(db.(*sql.DB), requestUserUUID, uuid, &pending); err != nil {
		fmt.Println("error", err)
	}

	SafeUser := map[string]interface{}{
		"fName":       user.Firstname,
		"lName":       user.Lastname,
		"email":       user.Email,
		"birthdate":   user.Birthdate,
		"description": user.Aboutme,
		"followers":   len(followers),
		"following":   len(following),
		"uuid":        uuid,
		"nName":       user.Nickname,
		"token":       uuid,
		"posts":       posts,
		"avatar":      user.Profilepicture,
		"private":     user.Private,
		"pending":     pending,
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(SafeUser)
}

func PrivacyHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode((map[string]string{"error": "invalid request"}))
		return
	}

	requestUserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	if err := Query.UpdatePrivacy(db.(*sql.DB), requestUserUUID, user.Private); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "failed to update privacy setting"})
		return
	}

	// Envoyer une réponse de succès
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"success": "privacy setting updated successfully"})
}
