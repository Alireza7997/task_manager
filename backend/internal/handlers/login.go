package handlers

import (
	"github.com/alireza/api/internal/database"
	middleware "github.com/alireza/api/internal/middlewares"
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	query := database.DB.Exec("SELECT username FROM users WHERE username = ?", username)
	if query.RowsAffected == 0 {
		c.JSON(401, gin.H{
			"message": "User does not exist",
		})
		return
	}
	var user models.User
	database.DB.Exec("SELECT * FROM users WHERE username = ?", username).Find(&user)
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		c.JSON(401, gin.H{
			"message": "username and password do not match",
		})
		return
	}
	session, _ := middleware.Store.Get(c.Request, "session")
	session.Values["user"] = user
	session.Save(c.Request, c.Writer)
	c.JSON(200, gin.H{
		"message": "Logged In",
	})

}
