package projectService

import (
	"errors"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type ProjectService struct{}

var service = &ProjectService{}

func (p *ProjectService) CreateProject(db *goqu.Database, proj models.Project) (*models.Project, error) {
	proj.CreatedAt = time.Now().Local()
	_, err := db.Insert(models.ProjectName).Rows(proj).Executor().Exec()
	if err != nil {
		return nil, errors.New("")
	}

	project, err := p.GetProject(db, proj.UserID)
	if err != nil {
		return nil, errors.New("")
	}
	return project, nil
}

func (p *ProjectService) GetProject(db *goqu.Database, projectID uint) (*models.Project, error) {
	project := &models.Project{}
	ok, _ := db.From(models.ProjectName).Where(goqu.Ex{
		"id": projectID,
	}).Executor().ScanStruct(&project)
	if !ok {
		return nil, errors.New("")
	}
	return project, nil
}

func (p *ProjectService) GetProjects(db *goqu.Database, userID uint) ([]models.Project, error) {
	projects := []models.Project{}
	ok, _ := db.From(models.ProjectName).Where(goqu.Ex{
		"user_id": userID,
	}).Executor().ScanStruct(&projects)
	if !ok {
		return nil, errors.New("")
	}
	return projects, nil
}

func (p *ProjectService) DeleteProject(db *goqu.Database, projectID uint) error {
	_, err := db.Delete(models.ProjectName).Where(goqu.Ex{
		"id": projectID,
	}).Executor().Exec()
	if err != nil {
		return errors.New("")
	}
	return nil
}

func New() contract.ProjectInterface {
	return service
}
