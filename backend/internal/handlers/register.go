package handlers

import (
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func Register(c *gin.Context) {
	req := &RegisterRequest{}
	s := userService.New()

	// Parse json
	if !utils.ParseJson(req, c) {
		return
	}

	// Validate user input
	if err := validators.RegisterValidator.Validate(*req); err != nil {
		c.JSON(400, gin.H{"errors": err})
		return
	}

	// Hashing password
	hashedPassword, err := s.HashPassword(req.Password)
	if err != nil {
		c.JSON(500, gin.H{"errors": err})
		return
	}

	// Creating user
	model := &models.User{
		Username: req.Username,
		Password: hashedPassword,
		Email:    req.Email,
	}
	user, err := s.CreateUser(database.DB, *model)
	if err != nil {
		c.JSON(500, err)
		return
	}

	c.JSON(201, user)
}
