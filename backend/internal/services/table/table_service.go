package tableService

import (
	"database/sql"
	"errors"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TableService struct{}

var service = &TableService{}

func (t *TableService) CreateTable(db *goqu.Database, tbl models.Table) (*models.Table, error) {
	tbl.CreatedAt = time.Now().Local()

	lastTable, err := t.GetLastTable(db, tbl.ProjectID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	if err == sql.ErrNoRows {
		_, err := db.Insert(models.TableName).Rows(tbl).Executor().Exec()
		if err != nil {
			return nil, err
		}
		table, err := t.GetTableByCA(db, tbl.CreatedAt)
		if err != nil {
			return nil, err
		}

		return table, nil
	} else {
		_, err := db.Insert(models.TableName).Rows(tbl).Executor().Exec()
		if err != nil {
			return nil, err
		}
		table, err := t.GetTableByCA(db, tbl.CreatedAt)
		if err != nil {
			return nil, err
		}

		err = t.UpdateNext(db, lastTable.ID, table.ID)
		if err != nil {
			return nil, err
		}

		return table, nil
	}

}

func (t *TableService) GetTableByCA(db *goqu.Database, timestamp time.Time) (*models.Table, error) {
	table := &models.Table{}
	ok, _ := db.From(models.TableName).Where(goqu.Ex{
		"created_at": timestamp,
	}).Executor().ScanStruct(table)
	if !ok {
		return nil, errors.New("")
	}
	return table, nil
}

func (t *TableService) GetTableByID(db *goqu.Database, id uint) (*models.Table, error) {
	table := &models.Table{}
	_, err := db.From(models.TableName).Where(goqu.Ex{
		"id": id,
	}).Executor().ScanStruct(table)
	if err != nil {
		return nil, err
	}
	return table, nil
}

func (t *TableService) GetLastTable(db *goqu.Database, projectID uint) (*models.Table, error) {
	table := &models.Table{}
	_, err := db.From(models.TableName).Where(goqu.Ex{
		"next":       0,
		"project_id": projectID,
	}).Executor().ScanStruct(table)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	return table, nil
}

func (t *TableService) GetFirstTable(db *goqu.Database, projectID uint) (*models.Table, error) {
	table := &models.Table{}
	_, err := db.From(models.TableName).Where(goqu.C("project_id").Eq(projectID)).Where(goqu.C("id").NotIn(db.From(models.TableName).Select("next"))).Executor().ScanStruct(table)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	return table, nil
}

func (t *TableService) GetTables(db *goqu.Database, projectID uint) ([]models.Table, error) {
	tables := []models.Table{}
	err := db.From(models.TableName).Where(goqu.Ex{
		"project_id": projectID,
	}).Executor().ScanStructs(&tables)
	if err != nil {
		return nil, errors.New("")
	}
	return tables, nil
}

func (t *TableService) DeleteTable(db *goqu.Database, tableID uint) error {
	_, err := db.Delete(models.TableName).Where(goqu.Ex{
		"id": tableID,
	}).Executor().Exec()
	if err != nil {
		return errors.New("")
	}
	return nil
}

func (t *TableService) DragDrop(db *goqu.Database, tableID, cPrev, prev uint) error {
	// Getting the moved table from the database
	movedTable, err := t.GetTableByID(db, tableID)
	if err != nil {
		return err
	}

	// Getting the 'prev' table from the database
	prevTable, err := t.GetTableByID(db, prev)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	// Starting a new transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Updating the 'cPrev' table
	err = t.txUpdateNext(tx, cPrev, movedTable.Next)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	// Checking if the moved table is moved to the first row of the project
	if prev == 0 {

		// Getting the first table of the project
		firstTable, err := t.GetFirstTable(db, movedTable.ProjectID)
		if err != nil && err != sql.ErrNoRows {
			return err
		}

		// Updating the moved table
		err = t.txUpdateNext(tx, movedTable.ID, firstTable.ID)
		if err != nil && err != sql.ErrNoRows {
			return err
		}
	} else {

		// Updating the moved table
		err = t.txUpdateNext(tx, movedTable.ID, prevTable.Next)
		if err != nil && err != sql.ErrNoRows {
			return err
		}

		// Updating the 'prev' task
		err = t.txUpdateNext(tx, prev, movedTable.ID)
		if err != nil && err != sql.ErrNoRows {
			return err
		}
	}

	// Committing the transaction
	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (t *TableService) UpdateTable(db *goqu.Database, tableID uint, tableTitle string, tableDesc string) (*models.Table, error) {
	updateTime := time.Now().Local()
	_, err := db.From(models.TableName).Where(goqu.C("id").Eq(tableID)).Update().Set(goqu.Record{
		"title":       tableTitle,
		"description": tableDesc,
		"updated_at":  updateTime,
	}).Executor().Exec()
	if err != nil {
		return nil, errors.New("")
	}
	table, err := t.GetTableByID(db, tableID)
	if err != nil {
		return nil, errors.New("")
	}

	return table, nil
}

func (t *TableService) UpdateNext(db *goqu.Database, tableID uint, next uint) error {
	_, err := db.From(models.TableName).Where(goqu.C("id").Eq(tableID)).Update().Set(goqu.Record{
		"next": next,
	}).Executor().Exec()
	if err != nil {
		return err
	}

	return nil
}

func (t *TableService) txUpdateNext(tx *goqu.TxDatabase, tableID uint, next uint) error {
	if tableID == 0 {
		return sql.ErrNoRows
	}

	_, err := tx.From(models.TableName).Where(goqu.C("id").Eq(tableID)).Update().Set(goqu.Record{
		"next": next,
	}).Executor().Exec()
	if err != nil {
		if rErr := tx.Rollback(); rErr != nil {
			return rErr
		}

		return err
	}

	return nil
}

func New() contract.TableInterface {
	return service
}
