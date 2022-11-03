package taskService

import (
	"errors"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TaskService struct{}

var service = &TaskService{}

func (t *TaskService) CreateTask(db *goqu.Database, tsk models.Task) (*models.Task, error) {
	tsk.Done = false

	_, err := db.Insert(models.TaskName).Rows(tsk).Executor().Exec()
	if err != nil {
		return nil, errors.New("")
	}
	task, err := t.GetTask(db, tsk.ID)
	if err != nil {
		return nil, errors.New("")
	}
	return task, nil
}

func (t *TaskService) GetTask(db *goqu.Database, taskID uint) (*models.Task, error) {
	task := &models.Task{}
	ok, _ := db.From(models.TaskName).Where(goqu.Ex{
		"id": taskID,
	}).Executor().ScanStruct(&task)
	if !ok {
		return nil, errors.New("")
	}
	return task, nil
}

func (t *TaskService) GetTasks(db goqu.Database, tableID uint) ([]models.Task, error) {
	tasks := []models.Task{}
	ok, _ := db.From(models.TaskName).Where(goqu.Ex{
		"table_id": tableID,
	}).Executor().ScanStruct(&tasks)
	if !ok {
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
