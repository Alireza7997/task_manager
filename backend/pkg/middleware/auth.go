package middleware

import (
	"encoding/gob"
	"net/http"

	"github.com/alireza/backend/pkg/models"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
)

var store = sessions.NewCookieStore([]byte("super-secret"))

func init() {
	store.Options.HttpOnly = true
	store.Options.Secure = true
	gob.Register(&models.User{})
}
func Auth(c *gin.Context) {
	session, _ := store.Get(c.Request, "session")
	_, ok := session.Values["user"]
	if !ok {
		c.HTML(http.StatusBadRequest, "login.html", nil)
		c.Abort()
		return
	}
	c.Next()
}
