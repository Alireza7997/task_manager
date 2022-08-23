package handlers

import (
	"log"
	"time"
	"unicode"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	uServices "github.com/alireza/api/internal/services/user"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func Register(c *gin.Context) {
	req := &RegisterRequest{}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"message": "Fill blank fields",
		})
		return
	}

	// Registering validations
	if len(req.Username) < 5 || len(req.Username) > 64 {
		c.JSON(400, gin.H{
			"message": "Username should be 5-64 characters long",
		})
		return
	}
	for _, char := range req.Username {
		if !unicode.IsLetter(char) && !unicode.IsNumber(char) {
			c.JSON(400, gin.H{
				"message": "Only alphanumeric characters are allowed",
			})
			return
		}
	}
	if len(req.Password) < 8 || len(req.Password) > 100 {
		c.JSON(400, gin.H{
			"message": "Password should be 8-100 characters long",
		})
		return
	}
	// Importing user services
	s := uServices.New()
	if s.UserExists(database.DB, req.Username, req.Email) {
		c.JSON(400, gin.H{
			"message": "Username or Email already taken, try another",
		})
		return
	}
	// Hashing password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	// Creating user
	model := &models.User{
		Username:  req.Username,
		Password:  string(hash),
		Email:     req.Email,
		CreatedAt: time.Now().Local(),
	}
	user, err := s.CreateUser(database.DB, *model)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, user)
}
