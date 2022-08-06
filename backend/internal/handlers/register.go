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
	db := database.DB
	var user models.User
	user.Username = c.PostForm("username")
	password := c.PostForm("password")
	user.Email = c.PostForm("email")
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
			c.HTML(400, "register.html", gin.H{
				"message": "Only alphanumeric characters are allowed",
			})
			return
		}
	}
	query1 := database.DB.Exec("SELECT username FROM users WHERE username = ?", user.Username)
	if query1.RowsAffected != 0 {
		c.JSON(400, gin.H{
			"message": "Username is already taken, try another",
		})
		return
	}
	if len(password) < 8 || len(password) > 100 {
		c.JSON(400, gin.H{
			"message": "Password should be 8-100 characters long",
		})
		return
	}
	query2 := database.DB.Exec("SELECT email FROM users WHERE email = ?", user.Email)
	if query2.RowsAffected != 0 {
		c.JSON(400, gin.H{
			"message": "This email is used by another user",
		})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	user.Password = string(hash)
	db.Create(&user)
	c.JSON(200, gin.H{
		"message": "Successfully Registered",
	})
}
