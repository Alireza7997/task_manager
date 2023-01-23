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
		if err != nil && err != sql.ErrNoRows {
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
		err = t.UpdateNext(db, lastTask.ID, task.ID)
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
		return nil, errors.New("")
	}
	return task, nil
}

func (t *TaskService) GetTaskByID(db *goqu.Database, id uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"id": id,
	}).Executor().ScanStruct(task)
	if err != nil {
		return nil, errors.New("")
	}
	return task, nil
}

func (t *TaskService) GetTaskByNext(db *goqu.Database, nextID uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"next": nextID,
	}).Executor().ScanStruct(task)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		return nil, errors.New("")
	}
	return task, nil
}

func (t *TaskService) GetLastTask(db *goqu.Database, tableID uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.Ex{
		"next":     0,
		"table_id": tableID,
	}).Executor().ScanStruct(task)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	return task, nil
}

func (t *TaskService) GetFirstTask(db *goqu.Database, tableID uint) (*models.Task, error) {
	task := &models.Task{}
	_, err := db.From(models.TaskName).Where(goqu.C("table_id").Eq(tableID)).Where(goqu.C("id").NotIn(db.From(models.TaskName).Select("next"))).Executor().ScanStruct(task)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		return nil, errors.New("")
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
	deletedTask, err := t.GetTaskByID(db, taskID)
	if err != nil && err != sql.ErrNoRows {
		return errors.New("")
	}

	updatingTask, err := t.GetTaskByNext(db, taskID)
	if err == sql.ErrNoRows {
		_, err = db.Delete(models.TaskName).Where(goqu.Ex{
			"id": taskID,
		}).Executor().Exec()
		if err != nil {
			return errors.New("")
		}
	}
	if err != nil && err != sql.ErrNoRows {
		return errors.New("")
	}

	err = t.UpdateNext(db, updatingTask.ID, deletedTask.Next)
	if err != nil {
		return errors.New("")
	}

	_, err = db.Delete(models.TaskName).Where(goqu.Ex{
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
	// Getting the moved task from the database
	movedTask, err := t.GetTaskByID(db, taskID)
	if err != nil {
		return errors.New(err.Error())
	}
	// Getting the 'prev' task from the database
	prevTask, err := t.GetTaskByID(db, prev)
	if err != nil && err != sql.ErrNoRows {
		return errors.New(err.Error())
	}

	// Starting a new transaction
	tx, err := db.Begin()
	if err != nil {
		return errors.New(err.Error())
	}

	// Updating the 'cPrev' task
	err = t.txUpdateNext(tx, cPrev, movedTask.Next)
	if err != nil && err != sql.ErrNoRows {
		return errors.New(err.Error())
	}
	// Checking if the moved task is moved to the first row of the table
	if prev == 0 {
		// Getting the first task of the table
		firstTask, err := t.GetFirstTask(db, toTable)
		if err != nil && err != sql.ErrNoRows {
			return errors.New(err.Error())
		}
		// Updating the moved task
		err = t.txMUpdateNext(tx, movedTask.ID, toTable, firstTask.ID)
		if err != nil && err != sql.ErrNoRows {
			return errors.New(err.Error())
		}
	} else {
		// Updating the moved task
		err = t.txMUpdateNext(tx, movedTask.ID, toTable, prevTask.Next)
		if err != nil && err != sql.ErrNoRows {
			return errors.New(err.Error())
		}
		// Updating the 'prev' task
		err = t.txUpdateNext(tx, prev, movedTask.ID)
		if err != nil && err != sql.ErrNoRows {
			return errors.New(err.Error())
		}
	}
	// Committing the transaction
	if err = tx.Commit(); err != nil {
		return errors.New(err.Error())
	}

	return nil
}

func (t *TaskService) UpdateNext(db *goqu.Database, taskID uint, next uint) error {
	_, err := db.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
		"next": next,
	}).Executor().Exec()
	if err != nil {
		return err
	}

	return nil
}

func (t *TaskService) txUpdateNext(tx *goqu.TxDatabase, taskID uint, next uint) error {
	if taskID == 0 {
		return sql.ErrNoRows
	}
	updateTime := time.Now().Local()
	_, err := tx.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
		"next":       next,
		"updated_at": updateTime,
	}).Executor().Exec()
	if err != nil {
		if rErr := tx.Rollback(); rErr != nil {
			return rErr
		}

		return err
	}

	return nil
}

func (t *TaskService) txMUpdateNext(tx *goqu.TxDatabase, taskID uint, toTable uint, next uint) error {
	updateTime := time.Now().Local()
	_, err := tx.From(models.TaskName).Where(goqu.C("id").Eq(taskID)).Update().Set(goqu.Record{
		"table_id":   toTable,
		"next":       next,
		"updated_at": updateTime,
	}).Executor().Exec()
	if err != nil {
		if rErr := tx.Rollback(); rErr != nil {
			return rErr
		}

		return err
	}

	return nil
}

func New() contract.TaskInterface {
	return service
}
