package handlers

import (
	middleware "github.com/alireza/api/internal/middlewares"
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	session, _ := middleware.Store.Get(c.Request, "session")
	var user = &models.User{}
	var ok bool
	val := session.Values["user"]
	if user, ok = val.(*models.User); !ok {
		c.JSON(403, gin.H{
			"message": ":|",
		})
		return
	}
	c.JSON(200, gin.H{"user": user})
}
