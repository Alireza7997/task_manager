package routers

import (
	"github.com/alireza/api/internal/handlers"
	middleware "github.com/alireza/api/internal/middlewares"
	"github.com/gin-gonic/gin"
)

func SetUpRouters(r *gin.Engine) {
	// authentication
	authentication := r.Group("/auth")
	authentication.POST("/register", handlers.Register)
	authentication.POST("/login", handlers.Login)
	authentication.GET("/methods", handlers.Methods)
	authentication.POST("/refresh", handlers.Refresh)
	// authorization
	authorization := r.Group("/auth", middleware.Auth)
	authorization.GET("/logout", handlers.Logout)
	// private
	private := r.Group("/user", middleware.Auth)
	private.GET("me", handlers.Me)
}
