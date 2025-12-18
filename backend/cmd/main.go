package main

import (
	"github.com/liaa-aa/task-manager-project/backend/internal/database"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	db, err := database.NewPostgreSQL()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("database connected")
}
