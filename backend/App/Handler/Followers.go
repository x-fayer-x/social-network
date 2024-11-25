package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func UserFollowersHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	uuid := r.PathValue("uuid")
	// requestUserUUID := r.Header.Get("Session-Token")
	// uuid := Query.GetUserUUID(db.(*sql.DB), requestUserUUID)

	// get followers
	var followers []models.User
	err := Query.GetFollowers(db.(*sql.DB), uuid, &followers)
	if err != nil {
		fmt.Println("error getting followers", err)
		http.Error(w, "error to get followers", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(followers)
}

func ToggleFollowHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	uuid := r.Header.Get("Session-Token")

	var userTarget models.User
	err := json.NewDecoder(r.Body).Decode(&userTarget)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = Query.GetUserByUUID(db.(*sql.DB), userTarget.UUID, &userTarget)
	if err != nil {
		fmt.Println("error", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	requestUser := Query.GetUserUUID(db.(*sql.DB), uuid)
	pending := -1
	err = Query.GetPending(db.(*sql.DB), requestUser, userTarget.UUID, &pending)
	if err != nil {
		fmt.Println("error", err)
		// w.WriteHeader(http.StatusInternalServerError)
	}

	if pending == -1 {
		if userTarget.Private {
			pending = 0
		} else {
			pending = 1
		}
		if err := Query.AddFollower(db.(*sql.DB), requestUser, userTarget.UUID, &pending); err != nil {
			fmt.Println("error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		pending = -1
		if err := Query.RemoveFollower(db.(*sql.DB), requestUser, userTarget.UUID); err != nil {
			fmt.Println("error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	response := struct {
		Pending int `json:"pending"`
	}{
		Pending: pending,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func UserFollowsHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	uuid := r.PathValue("uuid")
	// requestUserUUID := r.Header.Get("Session-Token")
	// uuid := Query.GetUserUUID(db.(*sql.DB), requestUserUUID)

	// get followers
	var followers []models.User
	err := Query.UserFollow(db.(*sql.DB), uuid, &followers)
	if err != nil {
		fmt.Println("error getting followers", err)
		http.Error(w, "error to get followers", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(followers)
}

func AcceptFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	uuid := r.Header.Get("Session-Token")

	type Request struct {
		Sender string `json:"sender"`
		Choice string `json:"choice"`
	}
	var request Request
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	requestUser := Query.GetUserUUID(db.(*sql.DB), uuid)

	if request.Choice == "accept" {
		pending := 1
		if err := Query.UpdateFollower(db.(*sql.DB), request.Sender, requestUser, &pending); err != nil {
			fmt.Println("error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	} else {
		if err := Query.RemoveFollower(db.(*sql.DB), request.Sender, requestUser); err != nil {
			fmt.Println("error", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
