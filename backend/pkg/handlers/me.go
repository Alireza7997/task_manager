package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Me(c *gin.Context) {
	c.HTML(http.StatusOK, "me.html", nil)
}
