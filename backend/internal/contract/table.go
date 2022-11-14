package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type TableInterface interface {
	// Creates a Table
	CreateTable(db *goqu.Database, tbl models.Table) (*models.Table, error)
	// Gets a Table from Databse by table's ID
	GetTable(db *goqu.Database, findBy any) (*models.Table, error)
	// Gets Tables from Database by project's ID
	GetTables(db *goqu.Database, pID uint) ([]models.Table, error)
	// Deletes a Table from Database (by ID)
	DeleteTable(db *goqu.Database, tID uint) error
}
