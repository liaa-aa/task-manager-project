package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/liaa-aa/task-manager-project/backend/internal/model"
)

type TaskRepository interface {
	ListByUser(ctx context.Context, userID string) ([]*model.Task, error)
	GetByID(ctx context.Context, userID, taskID string) (*model.Task, error)
	Create(ctx context.Context, t *model.Task) error
	Update(ctx context.Context, t *model.Task) error
	Delete(ctx context.Context, userID, taskID string) error
}

type taskRepositoryPostgres struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) TaskRepository {
	return &taskRepositoryPostgres{db: db}
}

func (r *taskRepositoryPostgres) ListByUser(ctx context.Context, userID string) ([]*model.Task, error) {
	q := `
		SELECT id, user_id, category_id, status_id, priority_id, title, description, due_date, created_at, updated_at
		FROM tasks
		WHERE user_id=$1
		ORDER BY created_at DESC
	`
	rows, err := r.db.QueryContext(ctx, q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []*model.Task
	for rows.Next() {
		var t model.Task
		var cat sql.NullString
		var desc sql.NullString
		var due sql.NullTime
		var upd sql.NullTime

		if err := rows.Scan(
			&t.ID, &t.UserID, &cat, &t.StatusID, &t.PriorityID, &t.Title, &desc, &due, &t.CreatedAt, &upd,
		); err != nil {
			return nil, err
		}

		if cat.Valid {
			v := cat.String
			t.CategoryID = &v
		}
		if desc.Valid {
			v := desc.String
			t.Description = &v
		}
		if due.Valid {
			v := due.Time
			t.DueDate = &v
		}
		if upd.Valid {
			v := upd.Time
			t.UpdatedAt = &v
		}

		out = append(out, &t)
	}
	return out, rows.Err()
}

func (r *taskRepositoryPostgres) GetByID(ctx context.Context, userID, taskID string) (*model.Task, error) {
	q := `
		SELECT id, user_id, category_id, status_id, priority_id, title, description, due_date, created_at, updated_at
		FROM tasks
		WHERE id=$1 AND user_id=$2
	`
	var t model.Task
	var cat sql.NullString
	var desc sql.NullString
	var due sql.NullTime
	var upd sql.NullTime

	err := r.db.QueryRowContext(ctx, q, taskID, userID).Scan(
		&t.ID, &t.UserID, &cat, &t.StatusID, &t.PriorityID, &t.Title, &desc, &due, &t.CreatedAt, &upd,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if cat.Valid {
		v := cat.String
		t.CategoryID = &v
	}
	if desc.Valid {
		v := desc.String
		t.Description = &v
	}
	if due.Valid {
		v := due.Time
		t.DueDate = &v
	}
	if upd.Valid {
		v := upd.Time
		t.UpdatedAt = &v
	}

	return &t, nil
}

func (r *taskRepositoryPostgres) Create(ctx context.Context, t *model.Task) error {
	q := `
		INSERT INTO tasks (user_id, category_id, status_id, priority_id, title, description, due_date)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING id, created_at
	`
	return r.db.QueryRowContext(ctx, q,
		t.UserID, t.CategoryID, t.StatusID, t.PriorityID, t.Title, t.Description, t.DueDate,
	).Scan(&t.ID, &t.CreatedAt)
}

func (r *taskRepositoryPostgres) Update(ctx context.Context, t *model.Task) error {
	q := `
		UPDATE tasks
		SET category_id=$1, status_id=$2, priority_id=$3, title=$4, description=$5, due_date=$6, updated_at=now()
		WHERE id=$7 AND user_id=$8
		RETURNING updated_at
	`
	var upd sql.NullTime
	err := r.db.QueryRowContext(ctx, q,
		t.CategoryID, t.StatusID, t.PriorityID, t.Title, t.Description, t.DueDate,
		t.ID, t.UserID,
	).Scan(&upd)

	if errors.Is(err, sql.ErrNoRows) {
		return sql.ErrNoRows
	}
	if err != nil {
		return err
	}
	if upd.Valid {
		v := upd.Time
		t.UpdatedAt = &v
	}
	return nil
}

func (r *taskRepositoryPostgres) Delete(ctx context.Context, userID, taskID string) error {
	res, err := r.db.ExecContext(ctx, `DELETE FROM tasks WHERE id=$1 AND user_id=$2`, taskID, userID)
	if err != nil {
		return err
	}
	aff, _ := res.RowsAffected()
	if aff == 0 {
		return sql.ErrNoRows
	}
	return nil
}
