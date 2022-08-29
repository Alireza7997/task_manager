package tokenService

import (
	"time"

	"github.com/alireza/api/internal/contract"
	g "github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	"github.com/dgrijalva/jwt-go"
)

type TokenService struct{}

var service = &TokenService{}

func (t *TokenService) GenerateJWT(user *models.User) (tokenString string, err error) {
	expirationTime := time.Now().Add(20 * time.Minute)
	claims := &contract.Claims{
		Username: user.Username,
		Email:    user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(g.SecretKey)
	return
}

func New() contract.TokenInterface {
	return service
}
