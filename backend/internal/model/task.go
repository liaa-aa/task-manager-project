package model

import "time"

type Task struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	CategoryID  *string    `json:"category_id,omitempty"`
	StatusID    string     `json:"status_id"`
	PriorityID  string     `json:"priority_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}