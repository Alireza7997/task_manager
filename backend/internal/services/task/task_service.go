package taskService

import (
	"errors"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TaskService struct{}

var service = &TaskService{}

func (t *TaskService) CreateTask(db *goqu.Database, tsk models.Task) (*models.Task, error) {
	tsk.Done = false
	tsk.CreatedAt = time.Now().Local()

	_, err := db.Insert(models.TaskName).Rows(tsk).Executor().Exec()
	if err != nil {
		return nil, errors.New(err.Error())
	}
	task, err := t.GetTaskByCA(db, tsk.CreatedAt)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return task, nil
}

func (t *TaskService) GetTaskByCA(db *goqu.Database, timestamp time.Time) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"created_at": timestamp,
	}).Executor().ScanStruct(task)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return task, nil
}

func (t *TaskService) GetTaskByID(db *goqu.Database, id uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"id": id,
	}).Executor().ScanStruct(task)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return task, nil
}

func (t *TaskService) GetTasks(db goqu.Database, tableID uint) ([]models.Task, error) {
	tasks := []models.Task{}
	err := db.From(models.TaskName).Where(goqu.Ex{
		"table_id": tableID,
	}).Executor().ScanStructs(&tasks)
	if err != nil {
		return nil, errors.New("")
	}
	return tasks, nil
}

func (t *TaskService) DeleteTask(db goqu.Database, taskID uint) error {
	_, err := db.Delete(models.TaskName).Where(goqu.Ex{
		"id": taskID,
	}).Executor().Exec()
	if err != nil {
		return errors.New("")
	}
	return nil
}

func New() contract.TaskInterface {
	return service
}
