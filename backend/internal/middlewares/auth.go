package middleware

import (
	"github.com/alireza/api/internal/database"
	sessionService "github.com/alireza/api/internal/services/session"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/gin-gonic/gin"
)

func Auth(c *gin.Context) {
	sessionID := c.GetHeader("session_id")
	s := sessionService.New()
	u := userService.New()

	// Checking if there is even a sessionID
	if len(sessionID) == 0 {
		c.JSON(403, gin.H{
			"message": "unauthorized, login first",
		})
		c.Abort()
		return
	}

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

	// Setting "user" as parameter to get used by handlers
	c.Set("user", user)
	c.Set("session", session)
	c.Next()
}
