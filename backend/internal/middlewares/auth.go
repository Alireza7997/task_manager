package middleware

import (
	"database/sql"

	"github.com/alireza/api/internal/database"
	sessionServices "github.com/alireza/api/internal/services/session"
	"github.com/gin-gonic/gin"
)

func Auth(c *gin.Context) {
	// Getting value of session_id from header
	sessionID := c.GetHeader("session_id")
	if len(sessionID) == 0 {
		c.JSON(403, gin.H{
			"message": "No Session, Login first!",
		})
		c.Abort()
		return
	}
	// checking if received session exists in database, then retriving it from database
	s := sessionServices.New()
	session, err := s.GetSession(database.DB, sessionID)
	if err == sql.ErrNoRows {
		c.JSON(403, gin.H{
			"message": "Forbidden, Login first!",
		})
		c.Abort()
		return
	}
	// if session is expired
	if session.IsExpired() {
		c.JSON(403, gin.H{
			"message": "Session expired, Login first!",
		})
		c.Abort()
		return
	}
	// setting "user" as parameter to get used by handler
	c.Set("user", session)
	c.Set("session", session)
	c.Next()
}
