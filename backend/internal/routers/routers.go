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
	private.GET("/me", handlers.Me)
	// task manager
	// group 1
	managerPost := r.Group("/", middleware.Auth)
	managerPost.POST("/projects", handlers.ProjectPOST)
	managerPost.POST("/projects/:project_id/tables", handlers.TablePOST)
	managerPost.POST("/tables/:table_id/tasks", handlers.TaskPOST)
	// group 2
	manager := r.Group("/", middleware.Auth, middleware.CheckUser)
	manager.GET("/projects", handlers.ProjectGETALL)
	manager.GET("/projects/:project_id/tables", middleware.ContentRange, handlers.TableGETALL)
	manager.GET("/tables/:table_id/tasks", handlers.TaskGETALL)
	manager.GET("/projects/:project_id", handlers.ProjectGET)
	manager.GET("/tables/:table_id", handlers.TableGET)
	manager.GET("/tasks/:task_id", handlers.TaskGET)
	manager.DELETE("/projects/:project_id", handlers.ProjectDelete)
	manager.DELETE("/tables/:table_id", handlers.TableDelete)
	manager.DELETE("/tasks/:task_id", handlers.TaskDelete)
}
