package models

var TaskName = "tasks"

type Task struct {
	ID          uint   `db:"id" json:"id" goqu:"skipinsert"`
	Name        string `db:"name" json:"name"`
	Description string `db:"description" json:"description"`
	Done        bool   `db:"done" json:"done"`
	TableID     uint   `db:"table_id" json:"table_id"`
}
