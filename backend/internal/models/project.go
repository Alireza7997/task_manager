package models

import "time"

var ProjectName = "projects"

type Project struct {
	ID        uint      `db:"id" json:"id" goqu:"skipinsert"`
	Name      string    `db:"name" json:"name"`
	UserID    uint      `db:"user_id" json:"user_id"`
	CreatedAt time.Time `db:"created_at" json:"created_at" goqu:"skipupdate"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
