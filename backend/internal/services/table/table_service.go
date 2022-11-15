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

	_, err := db.Insert(models.TableName).Rows(tbl).Executor().Exec()
	if err != nil {
		return nil, errors.New("")
	}
	table, err := t.GetTableByCA(db, tbl.CreatedAt)
	if err != nil {
		return nil, errors.New("")
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

func New() contract.TableInterface {
	return service
}
