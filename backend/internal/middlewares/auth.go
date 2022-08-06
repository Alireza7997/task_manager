package middleware

import (
	"encoding/gob"

	"github.com/alireza/api/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
)

var Store = sessions.NewCookieStore([]byte("super-secret"))

func init() {
	Store.Options.HttpOnly = true
	Store.Options.Secure = true
	gob.Register(&models.User{})
}

func Auth(c *gin.Context) {
	session, _ := Store.Get(c.Request, "session")
	_, ok := session.Values["user"]
	if !ok {
		c.JSON(403, gin.H{
			"message": "Forbidden",
		})
		c.Abort()
		return
	}
	c.Next()
}
