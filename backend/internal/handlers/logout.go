package handlers

import (
	"github.com/alireza/api/internal/database"
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	session, _ := c.Get("session")
	database.DB.Delete(session)

	c.JSON(200, gin.H{
		"message": "Logged Out",
	})
}
