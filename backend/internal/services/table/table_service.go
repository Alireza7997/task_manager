package tableService

import (
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
	tbl.Next = 0

	_, err := db.Insert(models.TableName).Rows(tbl).Executor().Exec()
	if err != nil {
		return nil, err
	}
	table, err := t.GetTableByCA(db, tbl.CreatedAt)
	if err != nil {
		return nil, err
	}

	return table, nil
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
	ok, _ := db.From(models.TableName).Where(goqu.Ex{
		"id": id,
	}).Executor().ScanStruct(table)
	if !ok {
		return nil, errors.New("")
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

func New() contract.TableInterface {
	return service
}
