package sessionService

import (
	"errors"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type sessionService struct{}

var service = &sessionService{}

func (s *sessionService) GetSession(db *goqu.Database, id string) (*models.Session, error) {
	session := &models.Session{}
	ok, _ := db.From(models.SessionName).Where(goqu.Ex{
		"session_id": id,
	}).Executor().ScanStruct(session)
	if !ok {
		return nil, errors.New("session does not exist in the database")
	}

	return session, nil
}

func (s *sessionService) CreateSession(db *goqu.Database, data models.Session, expireAfter int64) (*models.Session, error) {
	data.Expiry = time.Now().Add(time.Duration(expireAfter) * time.Second)
	_, err := db.Insert(models.SessionName).Rows(data).Executor().Exec()
	if err != nil {
		return nil, errors.New("session did not create")
	}

	session, err := s.GetSession(db, data.SessionID)
	if err != nil {
		return nil, errors.New("session did not create")
	}

	return session, nil
}

func (s *sessionService) DeleteSession(db *goqu.Database, id string) error {
	_, err := db.Delete(models.SessionName).Where(goqu.Ex{
		"session_id": id,
	}).Executor().Exec()
	if err != nil {
		return errors.New("session did not delete")
	}

	return nil
}

func New() contract.SessionInterface {
	return service
}
