package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/go-chi/cors"
	"github.com/liaa-aa/task-manager-project/backend/internal/database"
	"github.com/liaa-aa/task-manager-project/backend/internal/handler"
	"github.com/liaa-aa/task-manager-project/backend/internal/repository"
	"github.com/liaa-aa/task-manager-project/backend/internal/service"
)

func main() {
	_ = godotenv.Load()
	db, err := database.NewPostgreSQL()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("database connected")
	
	userRepo := repository.NewUserRepositoryPostgres(db)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))



	r.Post("/register", authHandler.Register)
	r.Post("/login", authHandler.Login)
	r.Get("/users", authHandler.GetAllUsers)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("starting server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
