package handlers

import (
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	user := c.MustGet("user").(*models.User)
	c.JSON(200, user.Clean())
}
