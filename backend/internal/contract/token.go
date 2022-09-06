package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	User models.UserDetails `json:"user"`
	jwt.StandardClaims
}

type TokenInterface interface {
	// Creates and returns JWT
	GenerateJWT(user *models.User, expireAfter int64) (tokenString string, err error)
}
