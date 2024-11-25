package Query

import (
	"database/sql"
	"errors"

	models "Social-network/Database/Models"
)

func SetPrivacy(db *sql.DB, post *models.Post) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`INSERT INTO privacy (post_id, user_uuid) VALUES (?,?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, viewer := range post.ViewerList {
		_, err = stmt.Exec(post.ID, viewer)
		if err != nil {
			return err
		}
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	return nil
}

// UpdatePrivacy update the privacy of a user
func UpdatePrivacy(db *sql.DB, UUID string, newPrivacySetting bool) error {
	// Prépare une requête SQL pour mettre à jour la colonne `private` dans la table `users`
	stmt, err := db.Prepare(`UPDATE users SET private = ? WHERE uuid = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	var privacy int
	if newPrivacySetting {
		privacy = 1
	} else {
		privacy = 0
	}

	// Exécute la requête préparée avec la nouvelle valeur de confidentialité et l'UUID de l'utilisateur
	result, err := stmt.Exec(privacy, UUID)
	if err != nil {
		return err
	}

	// Vérifiez si la mise à jour a affecté des lignes
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return errors.New("aucune ligne affectée, vérifiez si l'UUID est correct")
	}
	return nil
}
