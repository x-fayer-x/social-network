package Handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func GetCommentsHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)
	postID := r.PathValue("post_id")

	// Get the comments from the database
	var comments []models.Comment
	err := Query.GetCommentsByPostID(db.(*sql.DB), postID, &comments)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to get comments", http.StatusInternalServerError)
		return
	}
	// Send the comments as a response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}

func CreateCommentHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// Decode the request body into a comment
	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	// Create the comment in the database
	err = Query.CreateComment(db.(*sql.DB), &comment)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}

	// Send a success response
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}
