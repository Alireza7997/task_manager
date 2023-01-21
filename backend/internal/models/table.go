package models

import "time"

var TableName = "tables"

type Table struct {
	ID          uint      `db:"id" json:"id" goqu:"skipinsert"`
	Title       string    `db:"title" json:"title"`
	Description string    `db:"description" json:"description"`
	ProjectID   uint      `db:"project_id" json:"project_id"`
	Next        uint      `db:"next"`
	CreatedAt   time.Time `db:"created_at" json:"created_at" goqu:"skipupdate"`
	UpdatedAt   time.Time `db:"updated_at" json:"updated_at"`
}
