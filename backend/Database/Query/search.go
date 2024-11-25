package Query

import (
	"database/sql"

	models "Social-network/Database/Models"
)

// fonction pour recuperer les user pour la search bar
func GetAllUsersByQuery(db *sql.DB, query string, usersArray *[]models.User) error {
	stmt, err := db.Prepare("SELECT first_name, last_name, nickname, uuid FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR nickname LIKE ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query("%"+query+"%", "%"+query+"%", "%"+query+"%")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var user models.User
		err = rows.Scan(&user.Firstname, &user.Lastname, &user.Nickname, &user.UUID)
		if err != nil {
			return err
		}
		*usersArray = append(*usersArray, user)
	}

	return nil
}

func GetAllGroupsByQuery(db *sql.DB, query string, groupsArray *[]models.Groups) error {
	stmt, err := db.Prepare("SELECT title, id FROM groups WHERE title LIKE ?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	rows, err := stmt.Query("%" + query + "%")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var group models.Groups
		err = rows.Scan(&group.Title, &group.ID)
		if err != nil {
			return err
		}
		*groupsArray = append(*groupsArray, group)
	}

	if err = rows.Err(); err != nil {
		return err
	}

	return nil
}
