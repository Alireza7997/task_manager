package sessionServices

import (
	"database/sql"
	"errors"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type SessionInterface interface {
	GetSession(db *goqu.Database, id string) (*models.Session, error)
	CreateSession(db *goqu.Database, data models.Session) (*models.Session, error)
	DeleteSession(db *goqu.Database, session any) error
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
func (s *sessionService) CreateSession(db *goqu.Database, data models.Session) (*models.Session, error) {
	_, err := db.Insert(models.SessionName).Rows(data).Executor().Exec()
	if err != nil {
		return nil, errors.New("failed creating session")
	}
	session, err := s.GetSession(db, data.SessionID)
	if err != nil {
		return nil, errors.New("failed creating session")
	}
	return session, nil
}
func (s *sessionService) DeleteSession(db *goqu.Database, id any) error {
	_, err := db.Delete(models.SessionName).Where(goqu.Ex{
		"session_id": id,
	}).Executor().Exec()
	if err != nil {
		return errors.New("failed to delete session")
	}
	return nil
}

func New() SessionInterface {
	return service
}
