package handlers

import (
	"net/http"
	"unicode"

	"github.com/alireza/backend/pkg/database"
	"github.com/alireza/backend/pkg/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func GetRegister(c *gin.Context) {
	c.HTML(http.StatusOK, "register.html", nil)
}

func PostRegister(c *gin.Context) {
	db := database.DB
	var user models.User
	user.Username = c.PostForm("username")
	user.Password = c.PostForm("password")
	user.Email = c.PostForm("email")

	//validating username (checking for alphanumeric characters only)
	for _, char := range user.Username {
		if !unicode.IsLetter(char) && !unicode.IsNumber(char) {
			c.HTML(http.StatusBadRequest, "register.html", gin.H{
				"message": "Only alphanumeric characters are allowed for username",
				"user":    user,
			})
			return
		}
	}
	//validating username (checking username length)
	if len(user.Username) < 5 || len(user.Username) > 64 {
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"message": "Username should be 5-64 characters long",
			"user":    user,
		})
		return
	}
	// checking if username exists
	query1 := database.DB.Exec("SELECT id FROM users WHERE username = ?", user.Username)
	if query1.RowsAffected != 0 {
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"message": "This username is already taken, Please try another",
			"user":    user,
		})
		return
	}
	//validating password
	if len(user.Password) < 8 || len(user.Password) > 100 {
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"message": "Password should be 8-64 characters long",
			"user":    user,
		})
		return
	}
	//validating email
	query2 := database.DB.Exec("SELECT * FROM users WHERE email = ?", user.Email)
	if query2.RowsAffected != 0 {
		c.HTML(http.StatusBadRequest, "register.html", gin.H{
			"message": "This Email is used by another user",
			"user":    user,
		})
		return
	}
	// creating hash from password
	passHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	user.PassHash = passHash

	db.Create(&user)
	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully Registered",
	})

}
