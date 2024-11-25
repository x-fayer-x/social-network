package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

func HandlerSearchBar(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey).(*sql.DB)

	query := r.URL.Query().Get("q")

	var userArray []models.User
	err := Query.GetAllUsersByQuery(db, query, &userArray)
	if err != nil {
		fmt.Println("error to get AllUser")
		http.Error(w, "error to get AllUser", http.StatusBadRequest)
		return
	}

	var groupArray []models.Groups
	err = Query.GetAllGroupsByQuery(db, query, &groupArray)
	if err != nil {
		fmt.Println("error to get AllGroups")
		http.Error(w, "error to get AllGroups", http.StatusBadRequest)
		return
	}

	result := map[string]interface{}{
		"users":  userArray,
		"groups": groupArray,
	}
	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(result); err != nil {
		http.Error(w, "error to encode users to JSON", http.StatusInternalServerError)
	}
}
