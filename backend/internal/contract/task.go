package contract

import (
	"time"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TaskInterface interface {
	// Creates a Task
	CreateTask(db *goqu.Database, tsk models.Task) (*models.Task, error)
	// Gets a Task from Database by task's creation time
	GetTaskByCA(db *goqu.Database, timestamp time.Time) (*models.Task, error)
	// Gets a Task from Database by task's ID
	GetTaskByID(db *goqu.Database, id uint) (*models.Task, error)
	// Gets Task from Database by table's ID
	GetTasks(db goqu.Database, tableID uint) ([]models.Task, error)
	// Deletes a task by task's ID
	DeleteTask(db goqu.Database, taskID uint) error
}
