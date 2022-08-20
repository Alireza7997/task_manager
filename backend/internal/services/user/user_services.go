package uServices

import (
	"database/sql"
	"errors"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

type userService struct{}

var service = &userService{}

type UserInterface interface {
	UserExists(db *goqu.Database, username, email string) bool
	GetUser(db *goqu.Database, username string) (*models.User, error)
	CreateUser(db *goqu.Database, data models.User) error
}

// Checks if the given username/email exists in the given database.
func (s *userService) UserExists(db *goqu.Database, username, email string) bool {
	sql, _ := db.From(models.UserName).Where(goqu.Ex{
		"username": username,
		"email":    email,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()
	return rows != 0
}

// Gets the user with given username from  the given database and returns it if exists.
func (s *userService) GetUser(db *goqu.Database, username string) (*models.User, error) {
	var user models.User
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"username": username}).Executor().ScanStruct(&user)
	if !ok {
		return nil, sql.ErrNoRows
	}
	return &user, nil
}

// Creates user in the given database with given information.
func (s *userService) CreateUser(db *goqu.Database, data models.User) error {
	_, err := db.Insert(models.UserName).Rows(data).Executor().Exec()
	if err != nil {
		return errors.New("register failed")
	}
	return nil
}

func New() UserInterface {
	return service
}
