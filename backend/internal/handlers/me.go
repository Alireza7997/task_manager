package handlers

import (
	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(200, user)
}
