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
		return nil, errors.New(err.Error())
	}

	project, err := p.GetProjectByCA(db, proj.CreatedAt)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return project, nil
}

func (p *ProjectService) GetProjectByCA(db *goqu.Database, timestamp time.Time) (*models.Project, error) {
	project := &models.Project{}
	_, err := db.From(models.ProjectName).Where(goqu.Ex{
		"created_at": timestamp,
	}).Executor().ScanStruct(project)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return project, nil
}
func (p *ProjectService) GetProjectByID(db *goqu.Database, id uint) (*models.Project, error) {
	project := &models.Project{}
	_, err := db.From(models.ProjectName).Where(goqu.Ex{
		"id": id,
	}).Executor().ScanStruct(project)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return project, nil
}
func (p *ProjectService) GetProjects(db *goqu.Database, userID uint) ([]models.Project, error) {
	projects := []models.Project{}
	err := db.From(models.ProjectName).Where(goqu.Ex{
		"user_id": userID,
	}).Executor().ScanStructs(&projects)
	if err != nil {
		return nil, errors.New(err.Error())
	}
	return projects, nil
}

func (p *ProjectService) DeleteProject(db *goqu.Database, projectID uint) error {
	_, err := db.Delete(models.ProjectName).Where(goqu.Ex{
		"id": projectID,
	}).Executor().Exec()
	if err != nil {
		return errors.New("5")
	}
	return nil
}

func New() contract.ProjectInterface {
	return service
}
