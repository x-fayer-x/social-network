package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

// function handler posts in get methode
func PostsHandler(w http.ResponseWriter, r *http.Request) {
	// get Token of user from header
	SessionToken := r.Header.Get("Session-Token")

	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	UserUUID := Query.GetUserUUID(db.(*sql.DB), SessionToken)

	var Posts []models.Post

	if err := Query.GetPost(db.(*sql.DB), UserUUID, &Posts); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(Posts)
}

// function handler posts in post methode
func PostHandler(w http.ResponseWriter, r *http.Request) {
	SessionToken := r.Header.Get("Session-Token")

	db := r.Context().Value(DatabaseKey)

	var post models.Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get user uuid from token
	post.UserUUID = Query.GetUserUUID(db.(*sql.DB), SessionToken)
	post.CreationDate = time.Now().Format("2006-01-02 15:04:05")

	var user models.User
	if err := Query.GetUserByUUID(db.(*sql.DB), post.UserUUID, &user); err != nil {
		http.Error(w, "failure to get User for post", http.StatusInternalServerError)
		return
	}

	err = Query.AddPost(db.(*sql.DB), &post)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}
	post.Name = user.Nickname

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

// function handler to return one post
func OnePostHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get post id from url query
	PostID := r.PathValue("id")

	// get the post from database
	var post models.Post
	Query.GetOnePost(db.(*sql.DB), PostID, &post)

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(post)
}

// func GetUserPostsHandler(w http.ResponseWriter, r *http.Request) {
// 	db := r.Context().Value(DatabaseKey)

// 	// get user uuid from url query
// 	UserUUID := r.PathValue("uuid")

// 	requestUserUUID := r.Header.Get("Session-Token")

// 	// get the post from database
// 	var posts []models.Post
// 	Query.GetPostUser(db.(*sql.DB), UserUUID, requestUserUUID, &posts)

// 	// send the response
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	json.NewEncoder(w).Encode(posts)
// }
