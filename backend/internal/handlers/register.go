package handlers

import (
	"log"
	"time"
	"unicode"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var user models.User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(400, gin.H{
			"message": "Error while binding",
		})
		return
	}
	user.CreatedAt = time.Now().Local()

	// registering validations
	if len(user.Username) < 5 || len(user.Username) > 64 {
		c.JSON(400, gin.H{
			"message": "Username should be 5-64 characters long",
		})
		return
	}
	for _, char := range user.Username {
		if !unicode.IsLetter(char) && !unicode.IsNumber(char) {
			c.JSON(400, gin.H{
				"message": "Only alphanumeric characters are allowed",
			})
			return
		}
	}
	if len(user.Password) < 8 || len(user.Password) > 100 {
		c.JSON(400, gin.H{
			"message": "Password should be 8-100 characters long",
		})
		return
	}

	if database.UserExists(user.Username, user.Email) {
		c.JSON(400, gin.H{
			"message": "Username or Email already taken, try another",
		})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	user.Password = string(hash)
	database.DB.Create(&user)
	c.JSON(200, gin.H{
		"message": "Successfully Registered",
	})
}
