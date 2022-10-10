package contract

import (
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
	"github.com/golang-jwt/jwt/v4"
)

var AccessTokenType = 0
var RefreshTokenType = 1

type Claims struct {
	TokenType int                `json:"token_type"`
	User      models.UserDetails `json:"user"`
	jwt.RegisteredClaims
}

type TokenInterface interface {
	// Creates and returns Access token
	GenerateAccessToken(user *models.User, expireAfter int64) (tokenString string, err error)
	// Creates and returns Refresh token
	GenerateRefreshToken(db *goqu.Database, user *models.User, expireAfter int64) (tokenString string, err error)
	// Returns if refresh token exists or not
	TokenExists(db *goqu.Database, token string) bool
	// Deletes Refresh Token
	DeleteRefreshToken(db *goqu.Database, tokenString string) error
}
