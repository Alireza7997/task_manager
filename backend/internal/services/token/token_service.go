package tokenService

import (
	"time"

	"github.com/alireza/api/internal/contract"
	g "github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	"github.com/doug-martin/goqu/v9"
	"github.com/golang-jwt/jwt/v4"
)

type TokenService struct{}

var service = &TokenService{}

func (t *TokenService) GenerateAccessToken(user *models.User, expireAfter int64) (tokenString string, err error) {
	expirationTime := time.Now().Add(time.Duration(expireAfter) * time.Second)
	claims := &contract.Claims{
		TokenType: 0,
		User:      user.UserDetails,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err = token.SignedString(g.CFG.SecretKey)
	return
}

func (t *TokenService) GenerateRefreshToken(db *goqu.Database, user *models.User, expireAfter int64) (string, error) {
	expirationTime := time.Now().Add(time.Duration(expireAfter) * time.Second)
	claims := &contract.Claims{
		TokenType: 1,
		User:      user.UserDetails,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(g.CFG.SecretKey)
	if err != nil {
		return "", err
	}

	model := models.RefreshToken{
		Token: tokenString,
	}

	_, err = db.Insert(models.RefreshTokenName).Rows(model).Executor().Exec()
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (t *TokenService) TokenExists(db *goqu.Database, token string) bool {
	sql, _ := db.From(models.RefreshTokenName).Where(goqu.Ex{
		"token": token,
	}).Executor().Exec()
	rows, _ := sql.RowsAffected()
	return rows != 0
}

func (t *TokenService) DeleteRefreshToken(db *goqu.Database, tokenString string) error {
	_, err := db.Delete(models.RefreshTokenName).Where(goqu.Ex{
		"token": tokenString,
	}).Executor().Exec()
	if err != nil {
		return err
	}
	return nil
}
func New() contract.TokenInterface {
	return service
}
