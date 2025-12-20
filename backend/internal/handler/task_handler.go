package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/liaa-aa/task-manager-project/backend/internal/middleware"
	"github.com/liaa-aa/task-manager-project/backend/internal/model"
	"github.com/liaa-aa/task-manager-project/backend/internal/service"
)

type TaskHandler struct {
	TaskService service.TaskService
}

func NewTaskHandler(taskService service.TaskService) *TaskHandler {
	return &TaskHandler{TaskService: taskService}
}

type taskReq struct {
	CategoryID   *string `json:"category_id"`   
	CategoryName string  `json:"category_name"` 
	StatusID     int     `json:"status_id"`
	PriorityID   int     `json:"priority_id"`
	Title        string  `json:"title"`
	Description  *string `json:"description"`
	DueDate      *string `json:"due_date"` 
}

func parseDueDate(s *string) (*time.Time, error) {
	if s == nil || *s == "" {
		return nil, nil
	}
	t, err := time.Parse("2006-01-02", *s)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (h *TaskHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}

	tasks, err := h.TaskService.List(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(tasks)
}

func (h *TaskHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	id := chi.URLParam(r, "id")

	task, err := h.TaskService.Get(r.Context(), id, userID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	if task == nil {
		http.Error(w, "not found", 404)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(task)
}

func (h *TaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}

	var req taskReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid payload", 400)
		return
	}

	due, err := parseDueDate(req.DueDate)
	if err != nil {
		http.Error(w, "due_date must be YYYY-MM-DD", 400)
		return
	}

	t := &model.Task{
		UserID:      userID,
		CategoryID:  req.CategoryID, 
		StatusID:    req.StatusID,
		PriorityID:  req.PriorityID,
		Title:       req.Title,
		Description: req.Description,
		DueDate:     due,
	}

	err = h.TaskService.Create(r.Context(), t, req.CategoryName)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(201)
	_ = json.NewEncoder(w).Encode(t)
}

func (h *TaskHandler) Update(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	id := chi.URLParam(r, "id")

	var req taskReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid payload", 400)
		return
	}

	due, err := parseDueDate(req.DueDate)
	if err != nil {
		http.Error(w, "due_date must be YYYY-MM-DD", 400)
		return
	}

	t := &model.Task{
		ID:          id,
		UserID:      userID,
		CategoryID:  req.CategoryID, 
		StatusID:    req.StatusID,
		PriorityID:  req.PriorityID,
		Title:       req.Title,
		Description: req.Description,
		DueDate:     due,
	}

	err = h.TaskService.Update(r.Context(), t, req.CategoryName)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(t)
}

func (h *TaskHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.GetUserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	id := chi.URLParam(r, "id")

	if err := h.TaskService.Delete(r.Context(), id, userID); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(204)
}
