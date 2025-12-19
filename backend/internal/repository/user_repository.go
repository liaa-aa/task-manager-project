package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
)

type UserRepository interface{
	CreateUser(ctx context.Context, user *model.User) error
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id string) (*model.User, error)
	GetAllUsers(ctx context.Context) ([]*model.User, error)
}

type userRepositoryPostgres struct {
	db *sql.DB
}

func NewUserRepositoryPostgres(db *sql.DB) UserRepository {
	return &userRepositoryPostgres{db: db}
}

func (r *userRepositoryPostgres) CreateUser(
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

func (r *userRepositoryPostgres) FindByEmail(
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

func (r *userRepositoryPostgres) FindByID(
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

func (r *userRepositoryPostgres) GetAllUsers(
	ctx context.Context,
	) ([]*model.User, error) {

		query := `
			SELECT id, name, email, password_hash, created_at
			FROM users
		`
		rows, err := r.db.QueryContext(ctx, query)
		if err != nil {
			return nil, err
		}
		defer rows.Close()

		var users []*model.User
		for rows.Next() {
			var user model.User
			err := rows.Scan(
				&user.ID,
				&user.Name,
				&user.Email,
				&user.PasswordHash,
				&user.CreatedAt,
			)
			if err != nil {
				return nil, err
			}
			users = append(users, &user)
		}

		return users, nil
}