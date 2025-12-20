package routes

import (
	"database/sql"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/liaa-aa/task-manager-project/backend/internal/handler"
	customMiddleware "github.com/liaa-aa/task-manager-project/backend/internal/middleware"
	"github.com/liaa-aa/task-manager-project/backend/internal/repository"
	"github.com/liaa-aa/task-manager-project/backend/internal/service"
)

func SetupRoutes(db *sql.DB) *chi.Mux {
	userRepo := repository.NewUserRepositoryPostgres(db)
	categoryRepo := repository.NewCategoryRepository(db)
	statusPrioritiesRepo := repository.NewStatusPrioritiesRepositoryPostgres(db)
	taskRepo := repository.NewTaskRepository(db)

	authService := service.NewAuthService(userRepo)
	taskService := service.NewTaskService(taskRepo, statusPrioritiesRepo, categoryRepo)

	authHandler := handler.NewAuthHandler(authService)
	taskHandler := handler.NewTaskHandler(taskService)
	categoryHandler := handler.NewCategoryHandler(service.NewCategoryService(categoryRepo))
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	}))

	r.Group(func(r chi.Router) {
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)
	})

	r.Group(func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware)
		r.Get("/users", authHandler.GetAllUsers)
	})

	r.Route("/task", func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware)
		r.Get("/", taskHandler.List)
		r.Post("/", taskHandler.Create)
		r.Get("/{id}", taskHandler.Get)
		r.Put("/{id}", taskHandler.Update)
		r.Delete("/{id}", taskHandler.Delete)
	})

	r.Route("/category", func(r chi.Router) {
		r.Use(customMiddleware.AuthMiddleware)
		r.Get("/", categoryHandler.List)
		r.Post("/", categoryHandler.Create)
		r.Delete("/{id}", categoryHandler.Delete)
	})

	return r
}
