package service

import (
	"context"
	"errors"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
	"github.com/liaa-aa/task-manager-project/backend/internal/repository"
)

type AuthService interface {
	Register(ctx context.Context, name, email, password string) (*model.User, error)
	Login(ctx context.Context, email, password string) (*model.User, error)
}

type authService struct {
	UserRepository repository.UserRepository
}

func NewAuthService(userRepository repository.UserRepository) AuthService {
	return &authService{UserRepository: userRepository}
}

func (s *authService) Register(
	ctx context.Context,
	name, email, password string,
	) (*model.User, error) {
			name = strings.TrimSpace(name)
			email = strings.ToLower(strings.TrimSpace(email))
			password = strings.TrimSpace(password)

			if name == "" || email == "" || password == "" {
				return nil, errors.New("name, email, and password cannot be empty")
			}

			exxistingUser, err := s.UserRepository.FindByEmail(ctx, email)
			if err != nil {
				return nil, err
			}
			if exxistingUser != nil {
				return nil, errors.New("user already exists")
			}

			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
			if err != nil {
				return nil, errors.New("failed to hash password")
			}

			user := &model.User{
				Name:     name,
				Email:    email,
				PasswordHash: string(hashedPassword),
			}
			
			if err := s.UserRepository.CreateUser(ctx, user); err != nil {
				return nil, err
			}

			return user, nil
	}
func (s *authService) Login(
	ctx context.Context,
	email, password string,
	) (*model.User, error) {
		email = strings.ToLower(strings.TrimSpace(email))
		password = strings.TrimSpace(password)

		if email == "" || password == "" {
			return nil, errors.New("email and password cannot be empty")
		}

		user, err := s.UserRepository.FindByEmail(ctx, email)
		if err != nil {
			return nil, errors.New("invalid email or password")
		}
		if user == nil {
			return nil, errors.New("invalid email or password")
		}

		if err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
			return nil, errors.New("invalid email or password")
		}
		return user,nil
	}