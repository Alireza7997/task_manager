package middleware

import (
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/icza/session"
)

func Auth(c *gin.Context) {
	sessionID := session.Get(c.Request)
	sessionCheck := database.DB.Exec("SELECT * FROM sessions WHERE session_id = ? ", sessionID)
	if sessionCheck.RowsAffected != 1 {
		c.Abort()
		return
	}
	var session models.Session
	sessionCheck.Find(&session)
	if session.IsExpired() {
		c.JSON(401, gin.H{
			"message": "Forbidden, Login first!",
		})
		c.Abort()
		return
	}
	c.Next()
}
