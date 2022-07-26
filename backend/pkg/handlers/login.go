package handlers

import (
	"net/http"

	"github.com/alireza/backend/pkg/database"
	"github.com/alireza/backend/pkg/models"
	"github.com/gin-gonic/gin"
)

func GetLogin(c *gin.Context) {
	c.HTML(http.StatusOK, "login.html", nil)
}

func PostLogin(c *gin.Context) {
	var user models.User
	user.Username = c.PostForm("username")
	user.Password = c.PostForm("password")

	//checking if user is registered
	query1 := database.DB.Exec("SELECT username FROM users WHERE username = ?", user.Username)
	if query1.RowsAffected != 1 {
		c.HTML(http.StatusBadRequest, "login.html", gin.H{
			"message": "user does not exist",
			"user":    user,
		})
		return
	}
	// HAS TO BE FIXED LATER !!!

	// err := bcrypt.CompareHashAndPassword(user.PassHash, []byte(password))
	// if err != nil {
	// 	log.Println("error: ", err)
	// 	c.HTML(http.StatusUnauthorized, "login.html", gin.H{
	// 		"message": "username and password do not match",
	// 	})
	// 	return
	// }

	query2 := database.DB.Exec("SELECT * FROM users WHERE password = ? AND username = ?", user.Password, user.Username)
	if query2.RowsAffected != 1 {
		c.HTML(http.StatusUnauthorized, "login.html", gin.H{
			"message": "username and password do not match",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "logged in",
	})
}
