package main

import (
	"fmt"
	"log"

	"Social-network/App"
	"Social-network/Database"
	"Social-network/Server"
)

func main() {
	db, err := Database.ConnectDB()
	if err != nil {
		log.Fatal("Error connecting to database")
	}

	err = Database.UseMigration(db)
	if err != nil {
		fmt.Println("Error migrate database", err)
	}

	Server.CreateServer(App.CreateApp(&db)).Run(db.DB)
}
