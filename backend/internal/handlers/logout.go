package handlers

import (
	"fmt"

	"github.com/alireza/api/internal/database"
	sessionServices "github.com/alireza/api/internal/services/session"
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	s := sessionServices.New()
	session, _ := c.Get("session")
	fmt.Println(session)
	err := s.DeleteSession(database.DB, session)
	if err != nil {
		c.JSON(500, err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Logged Out",
	})
}
