package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type ProjectInterface interface {
	// Creates a Project
	CreateProject(db *goqu.Database, proj models.Project) (*models.Project, error)
	// Gets a Project from Database by project's ID
	GetProject(db *goqu.Database, pID uint) (*models.Project, error)
	// Gets Projects form Database by user's ID
	GetProjects(db *goqu.Database, uID uint) ([]models.Project, error)
	// Deletes a Project (by ID)
	DeleteProject(db *goqu.Database, pID uint) error
}
