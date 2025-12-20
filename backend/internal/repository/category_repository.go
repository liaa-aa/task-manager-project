package repository

import (
	"context"
	"database/sql"
	
	"github.com/liaa-aa/task-manager-project/backend/internal/model"
)

type CategoryRepository interface {
	ExistOwned(ctx context.Context, categoryID, userID string) (bool, error)
	GetByName(ctx context.Context, name string, userID string) (*model.Category, error)
	Create(ctx context.Context, category *model.Category) error
	ListByUser(ctx context.Context, userID string) ([]*model.Category, error)
	Delete(ctx context.Context, categoryID string) error
}

type CategoryRepositoryPostgres struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) CategoryRepository {
	return &CategoryRepositoryPostgres{db: db}
}

func (r *CategoryRepositoryPostgres) ExistOwned(ctx context.Context, categoryID, userID string) (bool, error) {
	var ok bool
	query := `
	SELECT EXISTS (
		SELECT 1 FROM categories WHERE id = $1 AND user_id = $2
	)`
	err := r.db.QueryRowContext(ctx, query, categoryID, userID).Scan(&ok)
	if err != nil {
		return false, err
	}
	return ok, nil
}

func (r *CategoryRepositoryPostgres) GetByName(ctx context.Context, name string, userID string) (*model.Category, error) {
	query := `SELECT id, name, user_id, created_at FROM categories WHERE name = $1 AND user_id = $2`
	var c model.Category
	err := r.db.QueryRowContext(ctx, query, name, userID).Scan(&c.ID, &c.Name, &c.UserID, &c.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &c, nil
}

func (r *CategoryRepositoryPostgres) Create(ctx context.Context, category *model.Category) error {
	query := `INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id, created_at`
	return r.db.QueryRowContext(ctx, query, category.Name, category.UserID).Scan(&category.ID, &category.CreatedAt)
}

func (r *CategoryRepositoryPostgres) ListByUser(ctx context.Context, userID string) ([]*model.Category, error) {
	query := `SELECT id, name, user_id, created_at FROM categories WHERE user_id = $1 ORDER BY name`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []*model.Category
	for rows.Next() {
		var c model.Category
		err := rows.Scan(&c.ID, &c.Name, &c.UserID, &c.CreatedAt)
		if err != nil {
			return nil, err
		}
		categories = append(categories, &c)
	}

	return categories, nil
}


func (r *CategoryRepositoryPostgres) Delete(ctx context.Context, categoryID string) error {
	query := `DELETE FROM categories WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, categoryID)
	return err
}
