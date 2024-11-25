package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func GetGroupMessagesHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// get group id from the url
	id := r.PathValue("group_id")

	var messages []models.ChatGroups

	// get group messages
	err := Query.GetMessagesByGroupId(db.(*sql.DB), id, &messages)
	if err != nil {
		fmt.Println("error to get messages : ", err)
		http.Error(w, "error to get messages", http.StatusBadRequest)
		return
	}
	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(messages)
}

func GetUserMessages(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// get user id from the url
	target_uuid := r.PathValue("uuid")

	uuid := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	var messages []models.ChatUsers

	// get user messages
	err := Query.GetMessagesByUserUUID(db.(*sql.DB), uuid, target_uuid, &messages)
	if err != nil {
		fmt.Println("error to get messages : ", err)
		http.Error(w, "error to get messages", http.StatusBadRequest)
		return
	}
	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(messages)
}
