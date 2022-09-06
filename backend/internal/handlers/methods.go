package handlers

import (
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

func Methods(c *gin.Context) {
	c.JSON(200, validators.Methods)
}
