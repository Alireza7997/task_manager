package handlers

import (
	"database/sql"
	"time"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	uServices "github.com/alireza/api/internal/services/user"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req loginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, "Error while binding")
		return
	}
	s := uServices.New()
	user, err := s.GetUser(database.DB, req.Username)
	if err == sql.ErrNoRows {
		c.JSON(401, gin.H{
			"message": "User does not exist",
		})
		return
	}
	hasherr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if hasherr != nil {
		c.JSON(401, gin.H{
			"message": "username and password do not match",
		})
		return
	}

	session := models.Session{
		SessionID: uuid.NewString(),
		Expiry:    time.Now().Add(1800 * time.Second),
	}
	// database.DB.Create(&session)
	c.JSON(200, session)
}
