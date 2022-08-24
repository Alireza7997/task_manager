package handlers

import (
	"github.com/alireza/api/internal/database"
	sessionService "github.com/alireza/api/internal/services/session"
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	s := sessionService.New()
	session := c.GetString("session")
	err := s.DeleteSession(database.DB, session)
	if err != nil {
		c.JSON(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Logged Out",
	})
}
