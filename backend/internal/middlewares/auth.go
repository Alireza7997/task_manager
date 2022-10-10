package middleware

import (
	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	sessionService "github.com/alireza/api/internal/services/session"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/alireza/api/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func Auth(c *gin.Context) {
	sessionID := c.GetHeader("session_id")
	jwt := c.GetHeader("jwt")

	if len(sessionID) == 0 && len(jwt) == 0 {
		utils.Response(c, 403,
			"No Methods!",
			"There are no methods in request",
			nil)
		c.Abort()
		return
	}
	if len(sessionID) != 0 {
		sessionAuth(c, sessionID)
	}
	if len(jwt) != 0 {
		jwtAuth(c, jwt)
	}
	c.Next()
}

func sessionAuth(c *gin.Context, sessionID string) {
	s := sessionService.New()
	u := userService.New()

	// Checking if received session exists in database, then retrieving it from database
	session, err := s.GetSession(database.DB, sessionID)
	if err != nil {
		utils.Response(c, 403,
			"Forbidden",
			err.Error(),
			nil)
		c.Abort()
		return
	}

	// Checking if session is expired
	if session.IsExpired() {
		utils.Response(c, 403,
			"Forbidden",
			"Session is expired",
			nil)
		c.Abort()
		return
	}

	// Checking if there is a user by passed UserID
	user, err := u.GetUserByID(database.DB, session.UserID)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		c.Abort()
		return
	}

	// Setting "user","session" and "method" as parameter to get used by handlers
	c.Set("user", user)
	c.Set("session", session)
	c.Set("method", "session")
}

func jwtAuth(c *gin.Context, jwtoken string) {
	// Parsing Token
	token, err := jwt.ParseWithClaims(jwtoken, &contract.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return global.CFG.SecretKey, nil
	})

	// Checking if the given token is valid
	if err != nil {
		utils.Response(c, 403,
			"Forbidden",
			"couldn't parse token",
			nil)
		c.Abort()
		return
	}
	if !token.Valid {
		utils.Response(c, 403,
			"Forbidden",
			"Invalid token",
			nil)
		return
	}

	// Getting the token claims
	claims, ok := token.Claims.(*contract.Claims)
	if !ok {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		c.Abort()
		return
	}
	if claims.TokenType != 0 {
		utils.Response(c, 403,
			"Forbidden",
			"The given token is not a access token",
			nil)
		return
	}

	user := &models.User{
		UserDetails: claims.User,
	}

	// Setting "user" and "method" as parameters to get used by handlers
	c.Set("user", user)
	c.Set("token", jwtoken)
	c.Set("method", "jwt")
}
