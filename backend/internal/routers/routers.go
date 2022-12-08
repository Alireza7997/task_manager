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
	manager1 := r.Group("/", middleware.Auth)
	manager1.POST("/projects", handlers.ProjectPOST)
	manager1.POST("/projects/:project_id/tables", handlers.TablePOST)
	manager1.POST("/tables/:table_id/tasks", handlers.TaskPOST)
	manager1.GET("/projects", middleware.ContentRange, handlers.ProjectGETALL)
	// group 2
	manager2 := r.Group("/", middleware.Auth, middleware.CheckUser)
	manager2.GET("/projects/:project_id/tables", handlers.TableGETALL)
	manager2.GET("/tables/:table_id/tasks", handlers.TaskGETALL)
	manager2.GET("/projects/:project_id", handlers.ProjectGET)
	manager2.GET("/tables/:table_id", handlers.TableGET)
	manager2.GET("/tasks/:task_id", handlers.TaskGET)
	manager2.DELETE("/projects/:project_id", handlers.ProjectDELETE)
	manager2.DELETE("/tables/:table_id", handlers.TableDELETE)
	manager2.DELETE("/tasks/:task_id", handlers.TaskDELETE)
	manager2.PUT("/projects/:project_id", handlers.ProjectPUT)
	manager2.PUT("/tables/:table_id", handlers.TablePUT)
	manager2.PUT("/tasks/:task_id", handlers.TaskPUT)
	manager2.PUT("/tasks/:task_id/to_table/:table_id", handlers.DragAndDrop)
}
