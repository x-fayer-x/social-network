package Query

import (
	"database/sql"
	"fmt"

	models "Social-network/Database/Models"
)

func GetGroupByID(db *sql.DB, id string, group *models.Groups) error {
	stmt, err := db.Prepare(`SELECT * FROM groups WHERE id = ?`)
	if err != nil {
		return err
	}

	err = stmt.QueryRow(id).Scan(&group.ID, &group.CreatorUUID, &group.Title, &group.Description, &group.CreationDate)
	if err != nil {
		return err
	}

	return nil
}

func GetGroupMembers(db *sql.DB, id string) ([]models.GroupMembers, error) {
	var groups_members []models.GroupMembers
	stmt, err := db.Prepare(`SELECT * FROM group_members WHERE group_id = ?`)
	if err != nil {
		return nil, err
	}

	rows, err := stmt.Query(id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var group_member models.GroupMembers
		if err := rows.Scan(&group_member.ID, &group_member.GroupID, &group_member.UserUuid, &group_member.Pending); err != nil {
			return nil, err
		}
		groups_members = append(groups_members, group_member)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	return groups_members, nil
}

func GetUserGroups(db *sql.DB, uuid string, groups *[]models.Groups) error {
	stmt, err := db.Prepare(`SELECT groups.id, groups.title, groups.description, groups.creator_uuid
	FROM groups
	INNER JOIN group_members ON groups.id = group_members.group_id
	WHERE group_members.member_uuid = ?`)
	if err != nil {
		fmt.Println("error to prepare the query GetUserGroups : ", err)
		return err
	}

	uuid = GetUserUUID(db, uuid)

	rows, err := stmt.Query(uuid)
	if err != nil {
		return err
	}
	defer rows.Close()

	// fmt.Println("rows dans query group getusersgroups", rows)

	for rows.Next() {
		var group models.Groups
		err := rows.Scan(&group.ID, &group.Title, &group.Description, &group.CreatorUUID)
		if err != nil {
			return err
		}
		*groups = append(*groups, group)
	}
	return nil
}

func CreateGroup(db *sql.DB, group *models.Groups) error {
	stmt, err := db.Prepare(`INSERT INTO groups(title, description, creator_uuid, created_at) VALUES(?, ?, ?, ?)`)
	if err != nil {
		return err
	}

	group.CreatorUUID = GetUserUUID(db, group.CreatorUUID)

	res, err := stmt.Exec(group.Title, group.Description, group.CreatorUUID, group.CreationDate)
	if err != nil {
		return err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return err
	}

	group.ID = int(id)

	return nil
}

func AddGroupMember(db *sql.DB, uuid string, groupID int, pending int) error {
	stmt, err := db.Prepare(`INSERT INTO group_members(group_id, member_uuid, pending) VALUES(?, ?, ?)`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(groupID, uuid, pending)
	if err != nil {
		return err
	}

	return nil
}

func GetGroupPosts(db *sql.DB, id string, posts *[]models.Post) error {
	stmt, err := db.Prepare(`SELECT posts.*, COALESCE(users.nickname, users.first_name || ' ' || users.last_name) AS user_name
	FROM posts 
	INNER JOIN users ON posts.user_uuid = users.uuid
	WHERE group_id = ?`)
	if err != nil {
		return err
	}

	rows, err := stmt.Query(id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var post models.Post
		var temp string
		var status string
		if err := rows.Scan(&post.ID, &post.UserUUID, &temp, &post.Body, &status, &post.CreationDate, &post.Privacy, &post.Name); err != nil {
			return err
		}
		*posts = append(*posts, post)
	}
	return nil
}

func GetFollowersForGroup(db *sql.DB, UserUUID string, group_id int, UserFollower *[]models.User) error {
	stmt, err := db.Prepare(`SELECT follows.following_uuid, COALESCE(users.nickname, users.first_name | ' ' | users.last_name) AS Name
    FROM follows 
    INNER JOIN users ON follows.following_uuid = users.uuid
    WHERE followed_uuid= ? AND following_uuid NOT IN (
        SELECT group_members.member_uuid FROM group_members WHERE group_members.group_id = ?
    )`)
	if err != nil {
		return err
	}

	rows, err := stmt.Query(UserUUID, group_id)
	if err != nil {
		return err
	}

	defer rows.Close()

	for rows.Next() {
		var follower models.User

		err := rows.Scan(&follower.UUID, &follower.Name)
		if err != nil {
			return err
		}
		*UserFollower = append(*UserFollower, follower)
	}
	return nil
}

func UpdatePendingStatus(db *sql.DB, groupID int, memberUUID string, pending int) error {
	stmt, err := db.Prepare(`UPDATE group_members SET pending = ? WHERE group_id = ? AND member_uuid = ?`)
	if err != nil {
		return fmt.Errorf("error preparing statement: %v", err)
	}

	_, err = stmt.Exec(pending, groupID, memberUUID)
	if err != nil {
		return fmt.Errorf("error executing update: %v", err)
	}
	fmt.Println("la fin de ma query updatependingstatut dans group.go l187")
	return nil
}
