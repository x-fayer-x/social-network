package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func GetNotifsHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	userUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	var notifs []models.Notification
	if err := Query.GetNotification(db.(*sql.DB), userUUID, &notifs); err != nil {
		fmt.Println("error to get notifs", err)
		http.Error(w, "error to get notifs", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(notifs)
}

func HandlerUpdateSeen(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	userUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	if err := Query.UpdateSeen(db.(*sql.DB), userUUID); err != nil {
		fmt.Println("error to update seen", err)
		http.Error(w, "error to update seen", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
