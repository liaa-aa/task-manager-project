package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/liaa-aa/task-manager-project/backend/internal/database"
	"github.com/liaa-aa/task-manager-project/backend/internal/handler"
	customMiddleware "github.com/liaa-aa/task-manager-project/backend/internal/middleware"
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

	categoryRepo := repository.NewCategoryRepository(db)
	statusPrioritiesRepo := repository.NewStatusPrioritiesRepositoryPostgres(db)
	taskRepo := repository.NewTaskRepository(db)
	
	taskService := service.NewTaskService(taskRepo, statusPrioritiesRepo, categoryRepo)

	taskHandler := handler.NewTaskHandler(taskService)

	r := chi.NewRouter()

	r.Use(middleware.Logger)   
    r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))
	
	r.Group(func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware) 
		r.Get("/users", authHandler.GetAllUsers)
	})

	r.Route("/task", func (r chi.Router)  {
		r.Use(customMiddleware.AuthMiddleware)
		r.Get("/", taskHandler.List)
		r.Post("/", taskHandler.Create)
		r.Get("/{id}", taskHandler.Get)
		r.Put("/{id}", taskHandler.Update)
		r.Delete("/{id}", taskHandler.Delete)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("starting server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
