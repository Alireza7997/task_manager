package handlers

import (
	"time"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type request struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req request
	var user models.User
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, "Error while binding")
		return
	}
	row := database.DB.Exec("SELECT * FROM users WHERE username = ?", req.Username)
	if row.RowsAffected == 0 {
		c.JSON(401, gin.H{
			"message": "User does not exist",
		})
		return
	}
	row.Find(&user)
	hasherr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if hasherr != nil {
		c.JSON(401, gin.H{
			"message": "username and password do not match",
		})
		return
	}
	if database.SessionExists(user.Username) {
		if sess := database.GetSession(user.Username); sess.IsExpired() {
			database.DB.Model(&models.Session{}).Where("user_name = ?", user.Username).Update("expiry", time.Now().Add(1800*time.Second))
			c.JSON(200, gin.H{
				"message": "Logged In\n",
				"data":    sess.SessionID,
			})
			return
		}

	}
	session := models.Session{
		User_name: user.Username,
		SessionID: uuid.NewString(),
		Expiry:    time.Now().Add(1800 * time.Second),
	}
	database.DB.Create(&session)
	database.DB.Model(&models.Session{}).AddForeignKey("user_name", "users(username)", "RESTRICT", "RESTRICT")
	c.JSON(200, gin.H{
		"message": "Logged In\n",
		"data":    session.SessionID,
	})
}
