package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
)

type userRepository interface{
	createUser(ctx context.Context, user *model.User) error
	findByEmail(ctx context.Context, email string) (*model.User, error)
	findByID(ctx context.Context, id string) (*model.User, error)
}

type userRepositoryPostgres struct {
	db *sql.DB
}

func NewUserRepositoryPostgres(db *sql.DB) userRepository {
	return &userRepositoryPostgres{db: db}
}

func (r *userRepositoryPostgres) createUser(
	ctx context.Context, 
	user *model.User,
	)error { 
	query := `
	INSERT INTO users (
	name, email, password_hash) 
	VALUES ($1, $2, $3)
	RETURNING id, created_at
	`
	err := r.db.QueryRowContext(
		ctx, 
		query, 
		user.Name,
		user.Email,
		user.PasswordHash,
	).Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (r *userRepositoryPostgres) findByEmail(
	ctx context.Context,
	email string,
	) (*model.User, error) {

		query := `
			SELECT id, name, email, password_hash, created_at
			FROM users
			WHERE email = $1
		`
		var user model.User

		err := r.db.QueryRowContext(ctx, query, email).
			Scan(
				&user.ID,
				&user.Name,
				&user.Email,
				&user.PasswordHash,
				&user.CreatedAt,
			)
		
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
		}

		return &user, nil
}

func (r *userRepositoryPostgres) findByID(
	ctx context.Context,
	id string,
	) (*model.User, error){

		query := `
			SELECT id, name, email, password_hash, created_at
			FROM users
			WHERE id = $1
		`
		var user model.User

		err := r.db.QueryRowContext(ctx, query, id).
			Scan(
				&user.ID,
				&user.Name,
				&user.Email,
				&user.PasswordHash,
				&user.CreatedAt,
			)
		
		if err != nil {
				if errors.Is(err, sql.ErrNoRows) {
				return nil, nil
			}
		return nil, err
	}
	return &user, nil
}