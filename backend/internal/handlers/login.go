package handlers

import (
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/models"
	sessionService "github.com/alireza/api/internal/services/session"
	tokenService "github.com/alireza/api/internal/services/token"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Method   string `json:"method"`
}

func Login(c *gin.Context) {
	req := &loginRequest{}
	u := userService.New()
	s := sessionService.New()
	t := tokenService.New()

	// Parse json
	if !utils.ParseJson(req, c) {
		return
	}

	// Validate
	if errors := validators.LoginValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid credentials",
			"Fields are not filled properly",
			errors)
		return
	}

	// Get user
	user, err := u.GetUser(database.DB, req.Username)
	if err != nil {
		utils.Response(c, 401,
			"User does not exist",
			err.Error(),
			nil)
		return
	}

	// Compare Password
	if !u.ComparePassword(req.Password, user.Password) {
		utils.Response(c, 401,
			"mismatched credentials",
			"Username and Password do not match",
			nil)
		return
	}

	// Generate Session if method is "session"
	if req.Method == "session" {
		// Session Creation
		model := &models.Session{
			SessionDetails: models.SessionDetails{
				UserID:    user.ID,
				SessionID: uuid.NewString(),
			},
		}
		session, err := s.CreateSession(database.DB, *model, global.CFG.SessionExpirySeconds)
		if err != nil {
			utils.Response(c, 500,
				"",
				err.Error(),
				nil)
			return
		}

		utils.Response(c, 200,
			"Session",
			session.SessionDetails,
			nil)
	}

	// Generate jwt if method is "jwt"
	if req.Method == "jwt" {
		// JWT Creation
		token1, err := t.GenerateAccessToken(user, global.CFG.AccessTokenExpirySeconds)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			return
		}

		token2, err := t.GenerateRefreshToken(database.DB, user, global.CFG.RefreshTokenExpirySeconds)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
		}

		utils.Response(c, 200,
			"Tokens",
			gin.H{
				"access_token":  token1,
				"refresh_token": token2,
			},
			nil)
	}
}
