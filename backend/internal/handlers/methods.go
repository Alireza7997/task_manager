package handlers

import (
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

func Methods(c *gin.Context) {
	utils.Response(c, 200,
		"Methods",
		validators.Methods,
		nil)
}
