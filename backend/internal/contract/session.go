package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type SessionInterface interface {
	// Return a session based on session_id
	GetSession(db *goqu.Database, id string) (*models.Session, error)
	// Creates and returns a session
	CreateSession(db *goqu.Database, data models.Session, expireAfter int64) (*models.Session, error)
	// Deletes a session
	DeleteSession(db *goqu.Database, session string) error
}
