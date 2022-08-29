package userService

import (
	"errors"
	"fmt"
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
	"golang.org/x/crypto/bcrypt"
)

type userService struct{}

var service = &userService{}

func (u *userService) UserExistsByUsername(db *goqu.Database, username string) bool {
	sql, _ := db.From(models.UserName).Where(goqu.Ex{
		"username": username,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()

	return rows != 0
}

func (u *userService) UserExistsByEmail(db *goqu.Database, email string) bool {
	sql, _ := db.From(models.UserName).Where(goqu.Ex{
		"email": email,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()

	return rows != 0
}

func (u *userService) GetUser(db *goqu.Database, username string) (*models.User, error) {
	user := &models.User{}
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"username": username}).Executor().ScanStruct(user)
	if !ok {
		return nil, fmt.Errorf("couldn't find a user based on %s username", username)
	}

	return user, nil
}

func (u *userService) CreateUser(db *goqu.Database, data models.User) (*models.User, error) {
	data.CreatedAt = time.Now().Local()

	_, err := db.Insert(models.UserName).Rows(data).Executor().Exec()
	if err != nil {
		return nil, errors.New("user creation failed")
	}

	user, err := u.GetUser(db, data.Username)
	if err != nil {
		return nil, errors.New("user creation failed")
	}

	return user, nil
}

func (u *userService) GetUserByID(db *goqu.Database, id uint) (*models.User, error) {
	user := &models.User{}
	ok, _ := db.From(models.UserName).Where(goqu.Ex{"id": id}).Executor().ScanStruct(user)
	if !ok {
		return nil, fmt.Errorf("couldn't find a user based on %d id", id)
	}

	return user, nil
}

func (u *userService) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", errors.New("password encryption failed")
	}

	return string(hashedPassword), nil
}

func (u *userService) ComparePassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func New() contract.UserInterface {
	return service
}
