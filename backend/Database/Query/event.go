package Query

import (
	"database/sql"
	"fmt"
	"strconv"

	models "Social-network/Database/Models"
)

func AddEvent(db *sql.DB, event *models.Events, userUUID string) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO events (group_id, creator_uuid, title, description, event_date, location) VALUES (?, ?, ?, ?, ?, ?)`)
	if err != nil {
		fmt.Println("error in preparing event : ", err)
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(event.GroupID, event.CreatorUUID, event.Title, event.Description, event.EventDate, event.Location)
	if err != nil {
		fmt.Println("error in insert event : ", err)
		return err
	}
	eventID, _ := result.LastInsertId()
	event.ID = int(eventID)

	group, err := GetGroupMembers(db, strconv.Itoa(event.GroupID))
	if err != nil {
		fmt.Println("error in getting group members : ", err)
		return err
	}
	for _, member := range group {
		stmt2, err := tx.Prepare(`INSERT INTO event_members (choice, user_uuid, event_id) VALUES (?, ?, ?)`)
		if err != nil {
			fmt.Println("error in preparing event members : ", err)
			return err
		}
		defer stmt2.Close()

		choice := 0

		if member.UserUuid == userUUID {
			choice = 1
		}

		_, err = stmt2.Exec(choice, member.UserUuid, eventID)
		if err != nil {
			fmt.Println("error in insert event members : ", err)
			return err
		}

	}

	if err := tx.Commit(); err != nil {
		fmt.Println("error in commit : ", err)
		return err
	}
	return nil
}

func GetEvents(db *sql.DB, groupids []string, events *[]models.Events, requestUserUUID string) error {
	// Prepare the SQL query
	stmt, err := db.Prepare("SELECT events.*, groups.title AS group_title FROM events INNER JOIN groups ON events.group_id = groups.id WHERE events.group_id = ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Get the events
	for _, groupID := range groupids {
		rows, err := stmt.Query(groupID)
		if err != nil {
			return err
		}
		defer rows.Close()

		for rows.Next() {
			var event models.Events
			err = rows.Scan(&event.ID, &event.GroupID, &event.CreatorUUID, &event.Title, &event.Description, &event.EventDate, &event.Location, &event.ImgPath, &event.GroupeTitle)
			if err != nil {
				rows.Close()
				return err
			}
			event.Choice, err = GetEventMemberChoice(db, event.ID, requestUserUUID)
			if err != nil {
				fmt.Println("error in getting event choice", err)
			}
			*events = append(*events, event)
		}
	}

	return nil
}

func GetEventMemberChoice(db *sql.DB, eventID int, user_uuid string) (int, error) {
	// Modifier la requête pour inclure une vérification sur user_uuid
	stmt, err := db.Prepare(`SELECT choice FROM event_members WHERE event_id = ? AND user_uuid = ?`)
	if err != nil {
		return 0, err
	}

	fmt.Println("eventID : ", eventID, "user_uuid : ", user_uuid)

	var choice int
	err = stmt.QueryRow(eventID, user_uuid).Scan(&choice)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("error in getting member choice: ", err)
			return 0, err
		}
		return 0, err
	}
	return choice, nil
}

func GetGroupIdsFromMemberId(db *sql.DB, memberid string) ([]string, error) {
	// get the group ids
	rows, err := db.Query("SELECT group_id FROM group_members WHERE member_uuid = ?", memberid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// get the group ids
	var groupids []string
	for rows.Next() {
		var groupid string
		err = rows.Scan(&groupid)
		if err != nil {
			fmt.Println("Error to get group ids : ", err)
			return nil, err
		}
		groupids = append(groupids, groupid)
	}
	return groupids, nil
}

func AddMemberEvent(db *sql.DB, choice int, memberUUID string, eventID int) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE event_members SET choice = ? WHERE user_uuid = ? AND event_id = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(choice, memberUUID, eventID)
	if err != nil {
		fmt.Println("Error to add member event : ", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
