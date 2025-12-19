package service

import (
	"context"
	"errors"
	"strings"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
	"github.com/liaa-aa/task-manager-project/backend/internal/repository"
)

type TaskService interface {
	List(ctx context.Context, userID string) ([]*model.Task, error)
	Get(ctx context.Context, taskID, userID string) (*model.Task, error)
	Create(ctx context.Context, task *model.Task, categoryName string) error
	Update(ctx context.Context, task *model.Task, categoryName string) error
	Delete(ctx context.Context, taskID, userID string) error
}

type taskService struct {
	TaskRepository             repository.TaskRepository
	StatusPrioritiesRepository repository.StatusPrioritiesRepository
	CategoryRepository         repository.CategoryRepository
}

func NewTaskService(
	taskRepository repository.TaskRepository,
	statusPrioritiesRepository repository.StatusPrioritiesRepository,
	categoryRepository repository.CategoryRepository,
) TaskService {
	return &taskService{
		TaskRepository:             taskRepository,
		StatusPrioritiesRepository: statusPrioritiesRepository,
		CategoryRepository:         categoryRepository,
	}
}

func (s *taskService) List(ctx context.Context, userID string) ([]*model.Task, error) {
	return s.TaskRepository.ListByUser(ctx, userID)
}

func (s *taskService) Get(ctx context.Context, taskID, userID string) (*model.Task, error) {
	return s.TaskRepository.GetByID(ctx, taskID, userID)
}

func (s *taskService) ensureCategory(ctx context.Context, userID, categoryName string) (*string, error) {
	name := strings.TrimSpace(categoryName)
	if name == "" {
		return nil, nil
	}

	existing, err := s.CategoryRepository.GetByName(ctx, name, userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		id := existing.ID
		return &id, nil
	}

	c := &model.Category{
		UserID: userID,
		Name:   name,
	}

	if err := s.CategoryRepository.Create(ctx, c); err != nil {
		ex2, err2 := s.CategoryRepository.GetByName(ctx, name, userID)
		if err2 == nil && ex2 != nil {
			id := ex2.ID
			return &id, nil
		}
		return nil, err
	}

	id := c.ID
	return &id, nil
}

func (s *taskService) Create(ctx context.Context, task *model.Task, categoryName string) error {
	task.Title = strings.TrimSpace(task.Title)

	if task.UserID == "" {
		return errors.New("user ID cannot be empty")
	}
	if task.Title == "" {
		return errors.New("task title cannot be empty")
	}

	if strings.TrimSpace(categoryName) != "" {
		newCatID, err := s.ensureCategory(ctx, task.UserID, categoryName)
		if err != nil {
			return err
		}
		task.CategoryID = newCatID
	}

	ok, err := s.StatusPrioritiesRepository.StatusExist(ctx, task.StatusID, task.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("invalid status ID")
	}

	ok, err = s.StatusPrioritiesRepository.PrioritiesExist(ctx, task.PriorityID, task.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("invalid priority ID")
	}

	if task.CategoryID != nil && *task.CategoryID != "" {
		owned, err := s.CategoryRepository.ExistOwned(ctx, *task.CategoryID, task.UserID)
		if err != nil {
			return err
		}
		if !owned {
			return errors.New("category does not belong to user")
		}
	}

	return s.TaskRepository.Create(ctx, task)
}

func (s *taskService) Update(ctx context.Context, task *model.Task, categoryName string) error {
	task.Title = strings.TrimSpace(task.Title)

	if task.UserID == "" {
		return errors.New("user ID cannot be empty")
	}
	if task.ID == "" {
		return errors.New("task ID cannot be empty")
	}
	if task.Title == "" {
		return errors.New("task title cannot be empty")
	}

	if strings.TrimSpace(categoryName) != "" {
		newCatID, err := s.ensureCategory(ctx, task.UserID, categoryName)
		if err != nil {
			return err
		}
		task.CategoryID = newCatID
	}

	ok, err := s.StatusPrioritiesRepository.StatusExist(ctx, task.StatusID, task.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("invalid status ID")
	}

	ok, err = s.StatusPrioritiesRepository.PrioritiesExist(ctx, task.PriorityID, task.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("invalid priority ID")
	}

	if task.CategoryID != nil && *task.CategoryID != "" {
		owned, err := s.CategoryRepository.ExistOwned(ctx, *task.CategoryID, task.UserID)
		if err != nil {
			return err
		}
		if !owned {
			return errors.New("category does not belong to user")
		}
	}

	return s.TaskRepository.Update(ctx, task)
}

func (s *taskService) Delete(ctx context.Context, taskID, userID string) error {
	if userID == "" || taskID == "" {
		return errors.New("userID and taskID required")
	}
	return s.TaskRepository.Delete(ctx, taskID, userID)
}
