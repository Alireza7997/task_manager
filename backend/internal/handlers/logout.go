package handlers

import (
	"github.com/alireza/api/internal/database"
	sessionService "github.com/alireza/api/internal/services/session"
	tokenService "github.com/alireza/api/internal/services/token"
	"github.com/alireza/api/internal/utils"
	"github.com/gin-gonic/gin"
)

func Logout(c *gin.Context) {
	s := sessionService.New()
	t := tokenService.New()
	method := c.GetString("method")

	if method == "session" {
		session := c.GetString("session")
		err := s.DeleteSession(database.DB, session)
		if err != nil {
			utils.Response(c, 500,
				"Internal Eerror",
				"",
				nil)
			return
		}
		utils.Response(c, 200,
			"Logged Out",
			"",
			nil)
	}
	if method == "jwt" {
		token := c.GetString("token")
		err := t.DeleteRefreshToken(database.DB, token)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			return
		}
		utils.Response(c, 200,
			"Logged Out",
			"",
			nil)
	} else {
		utils.Response(c, 403,
			"No Methods!!!",
			"",
			nil)
	}
}
