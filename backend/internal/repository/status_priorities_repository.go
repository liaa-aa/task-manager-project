package repository

import (
	"context"
	"database/sql"
)

type StatusPrioritiesRepository interface {
	StatusExist(ctx context.Context, statusID int, userID string) (bool, error)
	PrioritiesExist(ctx context.Context, priorityID int, userID string) (bool, error)
}

type StatusPrioritiesRepositoryPostgres struct {
	db *sql.DB
}

func NewStatusPrioritiesRepositoryPostgres(db *sql.DB) StatusPrioritiesRepository {
	return &StatusPrioritiesRepositoryPostgres{db: db}
}

func (r *StatusPrioritiesRepositoryPostgres) StatusExist(ctx context.Context, statusID int, userID string) (bool, error) {
	var ok bool
	query := `
	SELECT EXISTS (
		SELECT 1 FROM statuses WHERE id = $1 AND user_id = $2
	)`
	err := r.db.QueryRowContext(ctx, query, statusID, userID).Scan(&ok)
	return ok, err
}

func (r *StatusPrioritiesRepositoryPostgres) PrioritiesExist(ctx context.Context, priorityID int, userID string) (bool, error) {
	var ok bool
	query := `
	SELECT EXISTS (
		SELECT 1 FROM priorities WHERE id = $1 AND user_id = $2
	)`
	err := r.db.QueryRowContext(ctx, query, priorityID, userID).Scan(&ok)
	return ok, err
}
