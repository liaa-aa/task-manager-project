package model

import "time"

type Task struct {
	ID          string     `json:"id"`
	UserID      string     `json:"user_id"`
	CategoryID  *string    `json:"category_id,omitempty"`
	CategoryName *string    `json:"category_name,omitempty"`
	StatusID    int        `json:"status_id"`
	PriorityID  int        `json:"priority_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}