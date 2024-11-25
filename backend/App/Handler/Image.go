package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	Query "Social-network/Database/Query"
)

// Add an Avatar to the user
func AddAvatar(w http.ResponseWriter, r *http.Request) {
	// get the database from the context
	db := r.Context().Value(DatabaseKey)

	// get the user UUID from the URL
	// UserUUID := r.URL.Query().Get("uuid")
	// UserUUID := r.FormValue("uuid")
	UserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	// Parse the form
	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		fmt.Println("Error to parse form", err)
		http.Error(w, "Error to get Avatar", http.StatusInternalServerError)
		return
	}
	// Get the Avatar from the form
	image, headerImage, err := r.FormFile("Avatar")
	if err != nil {
		fmt.Println("Error to get Avatar from Form")
		http.Error(w, "Error to get Avatar from Form", http.StatusInternalServerError)
		return
	}
	defer image.Close()
	ext := filepath.Ext(headerImage.Filename)

	// Create a new Avatar File
	file, err := os.Create("./public/ressources/avatar/" + UserUUID + "_avatar" + ext) // App/static/avatar
	if err != nil {
		fmt.Println("Error to create file : ", err)
		http.Error(w, "Error to create file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Copy the Avatar Data into the file
	_, err = io.Copy(file, image)
	if err != nil {
		fmt.Println("Error to copy file")
		http.Error(w, "Error to copy file", http.StatusInternalServerError)
		return
	}

	// Store the Avatar in the database
	err = Query.StoreAvatar(db.(*sql.DB), UserUUID, "/ressources/avatar/"+UserUUID+"_avatar"+ext)
	if err != nil {
		fmt.Println("Error to store Avatar")
		http.Error(w, "Error to store Avatar", http.StatusInternalServerError)
		return
	}

	w.Write([]byte("/ressources/avatar/" + UserUUID + "_avatar" + ext))
}

// Delete the Avatar from the user
func DeleteAvatar(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	UserUUID := r.URL.Query().Get("uuid")

	result, err := Query.IsAvatar(db.(*sql.DB), UserUUID)
	if err != nil {
		http.Error(w, "Error to check if there is an Avatar", http.StatusInternalServerError)
		return
	}
	// if there is an avatar, delete the file and update the database
	if result {
		err = os.Remove("/static/avatar/" + UserUUID + "_avatar.png")
		if err != nil {
			http.Error(w, "Error to delete Avatar", http.StatusInternalServerError)
			return
		}
		err := Query.DeleteUserAvatar(db.(*sql.DB), UserUUID)
		if err != nil {
			http.Error(w, "Error to delete Avatar", http.StatusInternalServerError)
		}
	}
	http.Error(w, "There is no Avatar", http.StatusNotFound)
}

// Update the Avatar from the user
func UpdateAvatar(w http.ResponseWriter, r *http.Request) {
	UserUUID := r.URL.Query().Get("uuid")

	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		http.Error(w, "Error to get Avatar", http.StatusInternalServerError)
		return
	}

	image, _, err := r.FormFile("Avatar")
	if err != nil {
		http.Error(w, "error to get Avatar from Form", http.StatusInternalServerError)
		return
	}
	defer image.Close()

	// Delete the old Avatar File
	err = os.Remove("/static/avatar/" + UserUUID + "_avatar.png")
	if err != nil {
		http.Error(w, "Error to delete Avatar", http.StatusInternalServerError)
		return
	}

	// Create a new Avatar File
	file, err := os.Create("/static/avatar/" + UserUUID + "_avatar.png")
	if err != nil {
		http.Error(w, "Error to create file", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	// Copy the Avatar Data into the file
	_, err = io.Copy(file, image)
	if err != nil {
		http.Error(w, "error to copy data into the file", http.StatusInternalServerError)
		return
	}
}

// Handler for Add Image
func ImagePostHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// PostID := r.URL.Query().Get("id")
	PostID := r.FormValue("id")

	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		fmt.Println("failure Parse Form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute Parse Form")
		return
	}

	// change the image in Form file to apdate the field of the front form
	image, headerImage, err := r.FormFile("image")
	if err != nil {
		fmt.Println("failure get image of form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute get image of form")
		return
	}
	defer image.Close()
	ext := filepath.Ext(headerImage.Filename)

	file, err := os.Create("./public/ressources/post/" + PostID + "_post" + ext)
	if err != nil {
		fmt.Println("failure to create file", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
	defer file.Close()

	_, err = io.Copy(file, image)
	if err != nil {
		fmt.Println("failure to copy image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}

	if err := Query.StorePostImage(db.(*sql.DB), PostID, PostID+"_post"+ext); err != nil {
		fmt.Println("failure to store image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
}

func GetImagePostHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	PostID := r.PathValue("id")

	path := Query.GetPostImagePath(db.(*sql.DB), PostID)

	w.WriteHeader(http.StatusOK)
	// json.NewEncoder(w).Encode(path)
	w.Write([]byte(path))
}

func GetImageCommentHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	CommentID := r.PathValue("comment_id")

	path := Query.GetCommentImagePath(db.(*sql.DB), CommentID)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(path))
}

func CommentImageHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	CommentID := r.FormValue("id")

	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		fmt.Println("failure Parse Form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute Parse Form")
		return
	}

	// change the image in Form file to apdate the field of the front form
	image, headerImage, err := r.FormFile("image")
	if err != nil {
		fmt.Println("failure get image of form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute get image of form")
		return
	}
	defer image.Close()
	ext := filepath.Ext(headerImage.Filename)

	file, err := os.Create("./public/ressources/comment/" + CommentID + "_comment" + ext)
	if err != nil {
		fmt.Println("failure to create file", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
	defer file.Close()

	_, err = io.Copy(file, image)
	if err != nil {
		fmt.Println("failure to copy image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}

	if err := Query.StoreCommentImage(db.(*sql.DB), CommentID, CommentID+"_comment"+ext); err != nil {
		fmt.Println("failure to store image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
}

func ImageMessageHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	MessageID := r.FormValue("id")
	
	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		fmt.Println("failure Parse Form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute Parse Form")
		return
	}

	// change the image in Form file to apdate the field of the front form
	image, headerImage, err := r.FormFile("image")
	if err != nil {
		fmt.Println("failure get image of form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute get image of form")
		return
	}
	defer image.Close()
	ext := filepath.Ext(headerImage.Filename)

	file, err := os.Create("./public/ressources/chat_user/" + MessageID + "_message" + ext)
	if err != nil {
		fmt.Println("failure to create file", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
	defer file.Close()

	_, err = io.Copy(file, image)
	if err != nil {
		fmt.Println("failure to copy image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}

	if err := Query.StoreMessageImage(db.(*sql.DB), MessageID, MessageID+"_message"+ext); err != nil {
		fmt.Println("failure to store image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
}

func EventImageHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	EventID := r.FormValue("id")

	err := r.ParseMultipartForm(0 << 10)
	if err != nil {
		fmt.Println("failure Parse Form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute Parse Form")
		return
	}

	// change the image in Form file to apdate the field of the front form
	image, headerImage, err := r.FormFile("image")
	if err != nil {
		fmt.Println("failure get image of form", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failute get image of form")
		return
	}
	defer image.Close()
	ext := filepath.Ext(headerImage.Filename)

	file, err := os.Create("./public/ressources/event/" + EventID + "_event" + ext)
	if err != nil {
		fmt.Println("failure to create file", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
	defer file.Close()

	_, err = io.Copy(file, image)
	if err != nil {
		fmt.Println("failure to copy image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}

	if err := Query.StoreEventImage(db.(*sql.DB), EventID, EventID+"_event"+ext); err != nil {
		fmt.Println("failure to store image", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("failure to store image")
		return
	}
}

func GetImageEventHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	EventID := r.PathValue("event_id")

	path := Query.GetEventImagePath(db.(*sql.DB), EventID)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(path))
}
