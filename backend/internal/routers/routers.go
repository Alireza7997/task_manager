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
	// task manager
	// group 1
	managerPost := r.Group("/", middleware.Auth)
	managerPost.POST("/projects", handlers.ProjectPOST)
	managerPost.POST("/tables", handlers.TablePOST)
	managerPost.POST("/tasks", handlers.TaskPOST)
	// group 2
	manager := r.Group("/", middleware.Auth /* + second middleware */)
	manager.GET("/projects", handlers.ProjectGET)
	manager.DELETE("/projects/:id", handlers.ProjectDelete)
	manager.GET("/tables/:id", handlers.TableGET)
	manager.DELETE("/tables/:id", handlers.TableDelete)
	manager.GET("/tasks/:id", handlers.TaskGET)
	manager.DELETE("/tasks/:id", handlers.TaskDelete)
}
