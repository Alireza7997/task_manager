package contract

import (
	"time"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type ProjectInterface interface {
	// Creates a Project
	CreateProject(db *goqu.Database, proj models.Project) (*models.Project, error)
	// Gets a Project from Database by project's creation time
	GetProjectByCA(db *goqu.Database, timestamp time.Time) (*models.Project, error)
	// Gets Projects form Database by project's ID
	GetProjectByID(db *goqu.Database, id uint) (*models.Project, error)
	// Gets Projects form Database by user's ID
	GetProjects(db *goqu.Database, uID uint) ([]models.Project, error)
	// Deletes a Project by project's ID
	DeleteProject(db *goqu.Database, pID uint) error
	// Updates a project
	UpdateProject(db *goqu.Database, projectID uint, projectName string) (*models.Project, error)
}
