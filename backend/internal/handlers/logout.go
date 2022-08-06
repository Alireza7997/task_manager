package handlers

import (
	middleware "github.com/alireza/api/internal/middlewares"
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	session, _ := middleware.Store.Get(c.Request, "session")
	delete(session.Values, "user")
	session.Save(c.Request, c.Writer)
	c.JSON(200, gin.H{
		"message": "Logged Out",
	})
}
