package sessionServices

import (
	"database/sql"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type SessionInterface interface {
	GetSession(db *goqu.Database, id string) (*models.Session, error)
}

type sessionService struct{}

var service = &sessionService{}

func (s *sessionService) GetSession(db *goqu.Database, id string) (*models.Session, error) {
	var session models.Session
	ok, _ := db.From(models.SessionName).Where(goqu.Ex{
		"session_id": id,
	}).Executor().ScanStruct(&session)

	if !ok {
		return nil, sql.ErrNoRows
	}
	return &session, nil
}

func New() SessionInterface {
	return service
}
