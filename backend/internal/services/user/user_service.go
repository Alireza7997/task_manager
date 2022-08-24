package userService

import (
	"database/sql"
	"errors"
	"time"

	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
	"golang.org/x/crypto/bcrypt"
)

type userService struct{}

var service = &userService{}

type UserInterface interface {
	// Checks if passed username exists.
	UserExistsByUsername(db *goqu.Database, username string) bool
	// Checks if passed email exists.
	UserExistsByEmail(db *goqu.Database, email string) bool
	// Returns user with given username.
	GetUser(db *goqu.Database, username string) (*models.User, error)
	// Creates a user model.
	CreateUser(db *goqu.Database, data models.User) (*models.User, error)
	// Finds and returns a user based on it's id if exists.
	GetUserByID(db *goqu.Database, id int) (*models.User, error)
	// Hashes user Password
	HashPassword(password string) (string, error)
}

func (s *userService) UserExistsByUsername(db *goqu.Database, username string) bool {
	sql, _ := db.From(models.UserName).Where(goqu.Ex{
		"username": username,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()

	return rows != 0
}

func (s *userService) UserExistsByEmail(db *goqu.Database, email string) bool {
	sql, _ := db.From(models.UserName).Where(goqu.Ex{
		"email": email,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()

	return rows != 0
}

func (s *userService) GetUser(db *goqu.Database, username string) (*models.User, error) {
	user := &models.User{}
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"username": username}).Executor().ScanStruct(user)
	if !ok {
		return nil, sql.ErrNoRows
	}

	return user, nil
}

func (s *userService) CreateUser(db *goqu.Database, data models.User) (*models.User, error) {
	data.CreatedAt = time.Now().Local()

	_, err := db.Insert(models.UserName).Rows(data).Executor().Exec()
	if err != nil {
		return nil, errors.New("failed creating user")
	}

	user, err := s.GetUser(db, data.Username)
	if err != nil {
		return nil, errors.New("failed creating user")
	}

	return user, nil
}

func (s *userService) GetUserByID(db *goqu.Database, id int) (*models.User, error) {
	user := &models.User{}
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"id": id}).Executor().ScanStruct(user)
	if !ok {
		return nil, sql.ErrNoRows
	}

	return user, nil
}

func (s *userService) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("password encryption failed")
	}

	return string(hashedPassword), nil
}

func New() UserInterface {
	return service
}
