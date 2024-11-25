package utils

import (
	"time"

	models "Social-network/Database/Models"
)

func SortPost(posts *[]models.Post) {
	for i := 0; i < len(*posts); i++ {
		postDate, _ := time.Parse("2006-01-02 15:04:05", (*posts)[i].CreationDate)
		for j := i + 1; j < len(*posts); j++ {
			postDate2, _ := time.Parse("2006-01-02 15:04:05", (*posts)[j].CreationDate)
			if postDate.Before(postDate2) {
				(*posts)[i], (*posts)[j] = (*posts)[j], (*posts)[i]
			}
		}
	}
}
