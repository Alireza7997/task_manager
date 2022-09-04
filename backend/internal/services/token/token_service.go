package tokenService

import (
	"fmt"
	"time"

	"github.com/alireza/api/internal/contract"
	g "github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	"github.com/dgrijalva/jwt-go"
)

type TokenService struct{}

var service = &TokenService{}

func (t *TokenService) GenerateJWT(user *models.User, expireAfter int64) (tokenString string, err error) {
	fmt.Println(expireAfter)
	expirationTime := time.Now().Add(time.Duration(expireAfter) * time.Second)
	claims := &contract.Claims{
		User: user.UserDetails,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	fmt.Println(time.Now())
	fmt.Println(expirationTime)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(g.CFG.SecretKey)
	return
}

func New() contract.TokenInterface {
	return service
}
