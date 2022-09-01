package middleware

import (
	"time"

	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	sessionService "github.com/alireza/api/internal/services/session"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func Auth(c *gin.Context) {
	sessionID := c.GetHeader("session_id")
	jwt := c.GetHeader("jwt")

	if len(sessionID) == 0 && len(jwt) == 0 {
		c.JSON(403, gin.H{
			"message": "No auth Method !!",
		})
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
		c.JSON(403, gin.H{
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	// Checking if session is expired
	if session.IsExpired() {
		c.JSON(403, gin.H{
			"message": "unauthorized, session expired",
		})
		c.Abort()
		return
	}

	// Checking if there is a user by passed UserID
	user, err := u.GetUserByID(database.DB, session.UserID)
	if err != nil {
		c.JSON(500, gin.H{
			"message": "internal, no user found",
		})
		c.Abort()
		return
	}

	// Setting "user","session" and "method" as parameter to get used by handlers
	c.Set("user", user)
	c.Set("session", session)
	c.Set("method", "session")
}

func jwtAuth(c *gin.Context, jwtoken string) {
	// Checking if the given token is valid
	token, err := jwt.ParseWithClaims(jwtoken, &contract.Claims{}, func(t *jwt.Token) (interface{}, error) {
		return global.CFG.SecretKey, nil
	})

	if err != nil {
		c.JSON(403, gin.H{
			"message": "Invalid Token!",
		})
		c.Abort()
		return
	}

	// Getting the token claims
	claims, ok := token.Claims.(*contract.Claims)
	if !ok {
		c.JSON(500, gin.H{
			"message": "Internal Error, Failed to Parse Claims",
		})
		c.Abort()
		return
	}

	// Checking if token is expired
	if claims.ExpiresAt < time.Now().Unix() {
		c.JSON(403, gin.H{
			"message": "Token Expired",
		})
		c.Abort()
		return
	}

	user := &models.User{
		Username: claims.Username,
		Email:    claims.Email,
	}

	// Setting "user" and "method" as parameters to get used by handlers
	c.Set("user", user)
	c.Set("method", "jwt")
}
