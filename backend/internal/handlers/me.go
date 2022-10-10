package handlers

import (
	"github.com/alireza/api/internal/models"
	"github.com/alireza/api/internal/utils"
	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	user := c.MustGet("user").(*models.User)
	utils.Response(c, 200,
		"User",
		gin.H{
			"User": user.UserDetails,
		},
		nil)
}
