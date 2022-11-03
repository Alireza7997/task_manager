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
	if errors := validators.RegisterValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors)
		return
	}

	// Hashing password
	hashedPassword, err := s.HashPassword(req.Password)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	// Creating user
	model := &models.User{
		UserDetails: models.UserDetails{
			Username: req.Username,
			Email:    req.Email,
		},
		Password: hashedPassword,
	}
	user, err := s.CreateUser(database.DB, *model)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 201,
		"Registered",
		user.UserDetails,
		nil)
}
