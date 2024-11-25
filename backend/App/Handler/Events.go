package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func AddEventHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)
	UserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	// get the event from the request
	var event models.Events
	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		http.Error(w, "error to decode event", http.StatusBadRequest)
		return
	}

	// add the event
	err = Query.AddEvent(db.(*sql.DB), &event, UserUUID)
	if err != nil {
		http.Error(w, "error to add event", http.StatusBadRequest)
		return
	}
	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(event)
}

func GetEventsHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)
	UserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	// get the group id
	groupids, err := Query.GetGroupIdsFromMemberId(db.(*sql.DB), UserUUID)
	if err != nil {
		http.Error(w, "error to get group id", http.StatusBadRequest)
		return
	}

	var events []models.Events
	// get the events
	err = Query.GetEvents(db.(*sql.DB), groupids, &events, UserUUID)
	if err != nil {
		fmt.Println("error getting events", err)
		http.Error(w, "error to get events", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(events)
}

func AddEventChoiceHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)
	UserUUID := Query.GetUserUUID(db.(*sql.DB), r.Header.Get("Session-Token"))

	// get the event from the request
	var eventMember models.EventMembers
	err := json.NewDecoder(r.Body).Decode(&eventMember)
	if err != nil {
		http.Error(w, "error to decode event", http.StatusBadRequest)
		return
	}

	// get the event choice
	err = Query.AddMemberEvent(db.(*sql.DB), eventMember.Choice, UserUUID, eventMember.EventID)
	if err != nil {
		http.Error(w, "error to add creator members event", http.StatusInternalServerError)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(eventMember)
}
