package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	jwt.StandardClaims
}

type TokenInterface interface {
	// Creates and returns JWT
	GenerateJWT(user *models.User) (tokenString string, err error)
}
