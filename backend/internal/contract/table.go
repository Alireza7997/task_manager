package contract

import (
	"time"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TableInterface interface {
	// Creates a Table
	CreateTable(db *goqu.Database, tbl models.Table) (*models.Table, error)
	// Gets a Table from Databse by table's creation time
	GetTableByCA(db *goqu.Database, timestamp time.Time) (*models.Table, error)
	// Gets Tables from Database by table's ID
	GetTableByID(db *goqu.Database, id uint) (*models.Table, error)
	// Gets Tables from Database by project's ID
	GetTables(db *goqu.Database, pID uint) ([]models.Table, error)
	// Deletes a Table from Database by table's ID
	DeleteTable(db *goqu.Database, tID uint) error
	// Updates a table
	UpdateTable(db *goqu.Database, tableID uint, tableTitle string, tableDesc string) (*models.Table, error)
}
