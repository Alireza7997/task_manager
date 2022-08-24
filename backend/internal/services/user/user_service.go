package userService

import (
	"errors"
	"fmt"
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
	// Compares hashed password with raw password
	ComparePassword(password, hashedPassword string) bool
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
		return nil, fmt.Errorf("couldn't find a user based on %s username", username)
	}

	return user, nil
}

func (s *userService) CreateUser(db *goqu.Database, data models.User) (*models.User, error) {
	data.CreatedAt = time.Now().Local()

	_, err := db.Insert(models.UserName).Rows(data).Executor().Exec()
	if err != nil {
		return nil, errors.New("user creation failed")
	}

	user, err := s.GetUser(db, data.Username)
	if err != nil {
		return nil, errors.New("user creation failed")
	}

	return user, nil
}

func (s *userService) GetUserByID(db *goqu.Database, id int) (*models.User, error) {
	user := &models.User{}
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"id": id}).Executor().ScanStruct(user)
	if !ok {
		return nil, fmt.Errorf("couldn't find a user based on %d id", id)
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

func (s *userService) ComparePassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err != nil
}

func New() UserInterface {
	return service
}
