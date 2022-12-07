package models

import "time"

var TaskName = "tasks"

type Task struct {
	ID          uint      `db:"id" json:"id" goqu:"skipinsert"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	Done        bool      `db:"done" json:"done"`
	TableID     uint      `db:"table_id" json:"table_id"`
	Next        uint      `db:"next" json:"next"`
	CreatedAt   time.Time `db:"created_at" json:"created_at" goqu:"skipupdate"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}
