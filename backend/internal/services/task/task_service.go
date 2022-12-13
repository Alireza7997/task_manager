package taskService

import (
	"database/sql"
	"errors"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TaskService struct{}

var service = &TaskService{}

func (t *TaskService) CreateTask(db *goqu.Database, tsk models.Task) (task *models.Task, err error) {
	tsk.Done = false
	tsk.CreatedAt = time.Now().Local()
	lastTask, err := t.GetLastTask(db, tsk.TableID)
	if err == sql.ErrNoRows {
		_, err = db.Insert(models.TaskName).Rows(tsk).Executor().Exec()
		if err != nil {
			return
		}
		task, err = t.GetTaskByCA(db, tsk.CreatedAt)
		if err != nil {
			return
		}
		return
	} else if err != nil && err != sql.ErrNoRows {
		return
	} else {
		_, err = db.Insert(models.TaskName).Rows(tsk).Executor().Exec()
		if err != nil {
			return
		}
		task, err = t.GetTaskByCA(db, tsk.CreatedAt)
		if err != nil {
			return
		}
		err = t.dndUpdate(db, lastTask.ID, task.ID)
		if err != nil {
			return
		}
		return
	}
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

func (t *TaskService) GetLastTask(db *goqu.Database, tableID uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"next":     0,
		"table_id": tableID,
	}).Executor().ScanStruct(task)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return task, nil
}

func (t *TaskService) GetTasks(db *goqu.Database, tableID uint) ([]models.Task, error) {
	tasks := []models.Task{}
	err := db.From(models.TaskName).Where(goqu.Ex{
		"table_id": tableID,
	}).Executor().ScanStructs(&tasks)
	if err != nil {
		return nil, errors.New("")
	}
	return tasks, nil
}

func (t *TaskService) DeleteTask(db *goqu.Database, taskID uint) error {
	_, err := db.Delete(models.TaskName).Where(goqu.Ex{
		"id": taskID,
	}).Executor().Exec()
	if err != nil {
		return errors.New("")
	}
	return nil
}

func (t *TaskService) UpdateTask(db *goqu.Database, taskID uint, taskName string, taskDesc string) (*models.Task, error) {
	updateTime := time.Now().Local()
	_, err := db.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
		"name":        taskName,
		"description": taskDesc,
		"updated_at":  updateTime,
	}).Executor().Exec()
	if err != nil {
		return nil, errors.New("")
	}
	task, err := t.GetTaskByID(db, taskID)
	if err != nil {
		return nil, errors.New("")
	}

	return task, nil
}

func (t *TaskService) DragDrop(db *goqu.Database, taskID, toTable, cPrev, prev uint) error {
	// Getting 3 tasks from the database
	task1, err := t.GetTaskByID(db, taskID)
	if err != nil {
		return errors.New("")
	}
	task3, err := t.GetTaskByID(db, prev)
	if err != nil {
		return errors.New("")
	}

	// Updating given tasks
	tx, err := db.Begin()
	if err != nil {
		return errors.New("")
	}
	err = tx.Wrap(func() error {
		_, err1 := tx.From(models.TaskName).Where(goqu.C("id").Eq(cPrev)).Update().Set(goqu.Record{
			"next":       task1.Next,
			"updated_at": time.Now().Local(),
		}).Executor().Exec()
		_, err2 := tx.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
			"table_id":   toTable,
			"next":       task3.Next,
			"updated_at": time.Now().Local(),
		}).Executor().Exec()
		_, err3 := tx.From(models.TaskName).Where(goqu.C("id").Eq(prev)).Update().Set(goqu.Record{
			"next":       task1.ID,
			"updated_at": time.Now().Local(),
		}).Executor().Exec()
		if err1 != nil || err2 != nil || err3 != nil {
			return errors.New("")
		} else {
			return nil
		}
	})
	if err != nil {
		return errors.New("")
	}

	return nil
}

func (t *TaskService) dndUpdate(db *goqu.Database, taskID uint, next uint) error {
	updateTime := time.Now().Local()
	_, err := db.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
		"next":       next,
		"updated_at": updateTime,
	}).Executor().Exec()
	if err != nil {
		return errors.New("")
	}
	return nil
}

// func (t *TaskService) dndMainUpdate(db *goqu.Database, taskID uint, toTable uint, next uint) error {
// 	updateTime := time.Now().Local()
// 	_, err := db.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
// 		"table_id":   toTable,
// 		"next":       next,
// 		"updated_at": updateTime,
// 	}).Executor().Exec()
// 	if err != nil {
// 		return errors.New("")
// 	}
// 	return nil
// }

func New() contract.TaskInterface {
	return service
}
