package handlers

import (
	"fmt"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	sessionService "github.com/alireza/api/internal/services/session"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	req := &loginRequest{}
	u := userService.New()
	s := sessionService.New()

	// Parse json
	if !utils.ParseJson(req, c) {
		return
	}

	// Validate
	if errors := validators.LoginValidator.Validate(*req); errors != nil {
		c.JSON(400, gin.H{"errors": errors})
		return
	}

	// Get user
	user, err := u.GetUser(database.DB, req.Username)
	if err != nil {
		fmt.Println(err)
		c.JSON(401, gin.H{"message": err.Error()})
		return
	}

	// Compare Password
	if !u.ComparePassword(req.Password, user.Password) {
		c.JSON(401, gin.H{
			"message": "username and password do not match",
		})
		return
	}

	// Session Creation
	model := &models.Session{
		UserID:    user.ID,
		SessionID: uuid.NewString(),
	}
	session, err := s.CreateSession(database.DB, *model, global.CFG.ExpireTokenAfter)
	if err != nil {
		c.JSON(500, gin.H{"message": err.Error()})
		return
	}

	c.JSON(200, session)
}
