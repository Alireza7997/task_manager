package handlers

import (
	"database/sql"
	"time"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	Services "github.com/alireza/api/internal/services/session"
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
	u := uServices.New()
	user, err := u.GetUser(database.DB, req.Username)
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

	model := &models.Session{
		UserID:    user.ID,
		SessionID: uuid.NewString(),
		Expiry:    time.Now().Add(1800 * time.Second),
	}
	s := Services.New()
	session, err := s.CreateSession(database.DB, *model)
	if err != nil {
		c.JSON(500, "error while creating session")
		return
	}
	c.JSON(200, session)
}
