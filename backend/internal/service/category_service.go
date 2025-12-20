package service

import (
	"context"
	"errors"
	"strings"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
	"github.com/liaa-aa/task-manager-project/backend/internal/repository"
)

type CategoryService interface {
	List(ctx context.Context, userID string) ([]*model.Category, error)
	Create(ctx context.Context, userID, name string) (*model.Category, error)
	Delete(ctx context.Context, categoryID, userID string) error
}

type categoryService struct {
	CategoryRepository repository.CategoryRepository
}

func NewCategoryService(categoryRepository repository.CategoryRepository) CategoryService {
	return &categoryService{CategoryRepository: categoryRepository}
}

func (s *categoryService) List(ctx context.Context, userID string) ([]*model.Category, error) {
	return s.CategoryRepository.ListByUser(ctx, userID)
}

func (s *categoryService) Create(ctx context.Context, userID, name string) (*model.Category, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, errors.New("category name cannot be empty")
	}

	existing, err := s.CategoryRepository.GetByName(ctx, name, userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("category already exists")
	}

	category := &model.Category{
		Name:   name,
		UserID: userID,
	}

	if err := s.CategoryRepository.Create(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}


func (s *categoryService) Delete(ctx context.Context, categoryID, userID string) error {
	owned, err := s.CategoryRepository.ExistOwned(ctx, categoryID, userID)
	if err != nil {
		return err
	}
	if !owned {
		return errors.New("category not found")
	}

	return s.CategoryRepository.Delete(ctx, categoryID)
}