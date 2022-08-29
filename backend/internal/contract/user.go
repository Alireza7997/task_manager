package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
)

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
	GetUserByID(db *goqu.Database, id uint) (*models.User, error)
	// Hashes user Password
	HashPassword(password string) (string, error)
	// Compares hashed password with raw password
	ComparePassword(password, hashedPassword string) bool
}
