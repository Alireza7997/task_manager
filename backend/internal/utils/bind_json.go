package utils

import "github.com/gin-gonic/gin"

func ParseJson(data interface{}, c *gin.Context) bool {
	if err := c.BindJSON(data); err != nil {
		c.JSON(400, gin.H{
			"message": "bad json format",
		})
		return false
	}
	return true
}
