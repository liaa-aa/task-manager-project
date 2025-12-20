package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/liaa-aa/task-manager-project/backend/internal/database"
	"github.com/liaa-aa/task-manager-project/backend/internal/routes"
)

func main() {
	_ = godotenv.Load()
	db, err := database.NewPostgreSQL()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("database connected")

	r := routes.SetupRoutes(db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("starting server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
