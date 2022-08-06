package routers

import (
	"github.com/alireza/api/internal/handlers"
	middleware "github.com/alireza/api/internal/middlewares"
	"github.com/gin-gonic/gin"
)

func SetUpRouters(r *gin.Engine) {
	r.POST("/api/register", handlers.Register)
	r.POST("/api/login", handlers.Login)
	authGroup := r.Group("/user", middleware.Auth)
	authGroup.GET("/me", handlers.Me)
	authGroup.GET("/logout", handlers.Logout)

}
