package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func AddPostLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get Token of user from header
	SessionToken := r.Header.Get("Session-Token")

	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var like models.Like
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get user uuid from token
	like.User_uuid = Query.GetUserUUID(db.(*sql.DB), SessionToken)

	err = Query.AddPostLike(db.(*sql.DB), &like)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(like)
}

func AddCommentLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get Token of user from header
	SessionToken := r.Header.Get("Session-Token")

	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var like models.Like
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get user uuid from token
	like.User_uuid = Query.GetUserUUID(db.(*sql.DB), SessionToken)

	err = Query.AddCommentLike(db.(*sql.DB), &like)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(like)
}

func GetPostLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var likeList []models.Like

	// // get user uuid from token
	// user_uuid := Query.GetUserUUID(db.(*sql.DB), SessionToken)
	postID, err := strconv.Atoi(r.PathValue("post_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = Query.GetPostLike(db.(*sql.DB), postID, &likeList)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(likeList)
}

func GetCommentLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var likeList []models.Like

	commentID, err := strconv.Atoi(r.PathValue("comment_id"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = Query.GetCommentLike(db.(*sql.DB), commentID, &likeList)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(likeList)
}

func DeletePostLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get Token of user from header
	SessionToken := r.Header.Get("Session-Token")

	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var like models.Like

	like.PostID, _ = strconv.Atoi(r.PathValue("post_id"))

	// get user uuid from token
	like.User_uuid = Query.GetUserUUID(db.(*sql.DB), SessionToken)

	err := Query.DeletePostLike(db.(*sql.DB), &like)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(like)
}

func DeleteCommentLikeHandler(w http.ResponseWriter, r *http.Request) {
	// get Token of user from header
	SessionToken := r.Header.Get("Session-Token")

	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	var like models.Like

	like.CommentID, _ = strconv.Atoi(r.PathValue("comment_id"))

	// get user uuid from token
	like.User_uuid = Query.GetUserUUID(db.(*sql.DB), SessionToken)

	err := Query.DeleteCommentLike(db.(*sql.DB), &like)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("error", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(like)
}
