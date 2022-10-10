package handlers

import (
	"github.com/alireza/api/internal/contract"
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	tokenService "github.com/alireza/api/internal/services/token"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type RefreshRequest struct {
	Token string `json:"token"`
}

func Refresh(c *gin.Context) {
	req := &RefreshRequest{}
	t := tokenService.New()
	u := userService.New()

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		return
	}

	// Validating request
	if errors := validators.RefreshValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"No Token",
			"No token in request body",
			errors)
		return
	}

	// Parsing and Getting Token
	token, err := jwt.ParseWithClaims(req.Token, &contract.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return global.CFG.SecretKey, nil
	})

	// Checking if the given token is valid
	if err != nil {
		utils.Response(c, 403,
			"Forbidden",
			"Couldn't parse token",
			nil)
		return
	}
	if !token.Valid {
		utils.Response(c, 403,
			"Forbidden",
			"Invalid token",
			nil)
		return
	}

	// Parsing and Getting Claims
	claims, ok := token.Claims.(*contract.Claims)
	if !ok {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		c.Abort()
		return
	}

	// Checking Token's Type
	if claims.TokenType != 1 {
		utils.Response(c, 403,
			"Forbidden",
			"The given token is not a refresh token",
			nil)
		return
	}

	// Checking if Token Exists
	if !t.TokenExists(database.DB, req.Token) {
		utils.Response(c, 403,
			"Forbidden",
			"Please login first!",
			nil)
		return
	}

	// Getting User from Database
	user, err := u.GetUser(database.DB, claims.User.Username)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	// Deleting the Existing Token
	if err := t.DeleteRefreshToken(database.DB, req.Token); err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	// Creating New Tokens
	accessToken, err := t.GenerateAccessToken(user, global.CFG.AccessTokenExpirySeconds)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	refreshToken, err := t.GenerateRefreshToken(database.DB, user, global.CFG.RefreshTokenExpirySeconds)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	// Passing New Tokens
	utils.Response(c, 200,
		"New Tokens",
		gin.H{
			"new access token":  accessToken,
			"new refresh token": refreshToken,
		},
		nil)
}
