package utils

import "github.com/gin-gonic/gin"

func Response(c *gin.Context, statusCode int, title string, message, errMessage interface{}) {
	c.JSON(statusCode, gin.H{
		"status_code":   statusCode,
		"title":         title,
		"message":       message,
		"error_message": errMessage,
	})
}
