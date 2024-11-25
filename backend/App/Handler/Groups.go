package Handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	models "Social-network/Database/Models"
	Query "Social-network/Database/Query"
)

type UpdatePendingRequest struct {
	GroupID    int    `json:"group_id"`
	MemberUUID string `json:"member_uuid"`
	Pending    int    `json:"pending"`
}

func GroupInfosHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// get group id from the url
	id := r.PathValue("id")

	var group models.Groups

	// get group infos
	err := Query.GetGroupByID(db.(*sql.DB), id, &group)
	if err != nil {
		fmt.Println("error to get group : ", err)
		http.Error(w, "error to get group", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group)
}

func GroupListHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	uuid := r.PathValue("uuid")

	var groups []models.Groups

	// get user groups
	err := Query.GetUserGroups(db.(*sql.DB), uuid, &groups)
	if err != nil {
		fmt.Println("error to get groups : ", err)
		http.Error(w, "error to get groups", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(groups)
}

func CreateGroupHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// get the group infos from the body
	var group models.Groups
	err := json.NewDecoder(r.Body).Decode(&group)
	if err != nil {
		http.Error(w, "error to decode the group infos", http.StatusBadRequest)
		return
	}

	group.CreationDate = time.Now().Format("2006-01-02 15:04:05")

	// create the group
	err = Query.CreateGroup(db.(*sql.DB), &group)
	if err != nil {
		fmt.Println("error to create the group : ", err)
		http.Error(w, "error to create the group", http.StatusBadRequest)
		return
	}

	err = Query.AddGroupMember(db.(*sql.DB), group.CreatorUUID, group.ID, 1)
	if err != nil {
		http.Error(w, "error to add the creator to the group", http.StatusBadRequest)
		return
	}

	// err = Query.AddGroupMember(db.(*sql.DB), group.CreatorUUID, group.ID)

	// send the response
	w.WriteHeader(http.StatusCreated)
}

func GetGroupPostsHandler(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey)

	// get the group id from the url
	id := r.PathValue("id")

	var posts []models.Post

	// get group posts
	err := Query.GetGroupPosts(db.(*sql.DB), id, &posts)
	if err != nil {
		fmt.Println("error to get group posts : ", err)
		http.Error(w, "error to get group posts", http.StatusBadRequest)
		return
	}

	// send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func InviteGroupHandler(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey)

	// get user uuid from the url
	group_id, err := strconv.Atoi(r.PathValue("group_id"))
	if err != nil {
		fmt.Println("error in atoi")
	}
	requestUserUUID := r.Header.Get("Session-Token")
	uuid := Query.GetUserUUID(db.(*sql.DB), requestUserUUID)

	// get followers
	var followers []models.User
	err = Query.GetFollowersForGroup(db.(*sql.DB), uuid, group_id, &followers)
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

func HandlerAddMembersToGroup(w http.ResponseWriter, r *http.Request) {
	// Get database from context
	db := r.Context().Value(DatabaseKey).(*sql.DB)

	group_id := r.Header.Get("group_id")

	var users []models.User

	err := json.NewDecoder(r.Body).Decode(&users)
	if err != nil {
		log.Printf("Error decoding user info: %v", err)
		http.Error(w, "error to decode the user infos", http.StatusBadRequest)
		return
	}

	groupID, err := strconv.Atoi(group_id)
	if err != nil {
		fmt.Println("error in atoi")
		return
	}

	for _, user := range users {
		// if isMember, err := Query.IsGroupMember(db, user.UUID, groupID); isMember && err == nil {
		err = Query.AddGroupMember(db, user.UUID, groupID, 2)
		if err != nil {
			log.Printf("Error adding user to group: %v", err)
			http.Error(w, "error to add the user to the group", http.StatusBadRequest)
			return
		}
		// }
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}

func HandlerGetMemberByGroupId(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey).(*sql.DB)

	group_id := r.PathValue("group_id") // Obtenez le group_id à partir des paramètres de la requête

	var group_members []models.GroupMembers
	group_members, err := Query.GetGroupMembers(db, group_id)
	if err != nil {
		log.Printf("Error getting group members: %v", err)
		http.Error(w, "error to get the group members", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(group_members)
}

// HandlerUpdatePending met à jour le champ pending d'un utilisateur dans la table group_members
func HandlerUpdatePending(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value(DatabaseKey).(*sql.DB)

	var req UpdatePendingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if err := Query.UpdatePendingStatus(db, req.GroupID, req.MemberUUID, req.Pending); err != nil {
		log.Printf("Error updating pending status: %v", err)
		http.Error(w, "Failed to update pending status", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, `{"message": "Pending status updated successfully"}`)
}
