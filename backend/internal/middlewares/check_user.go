package middleware

import (
	"strconv"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	projectService "github.com/alireza/api/internal/services/project"
	tableService "github.com/alireza/api/internal/services/table"
	taskService "github.com/alireza/api/internal/services/task"
	"github.com/alireza/api/internal/utils"
	"github.com/gin-gonic/gin"
)

func CheckUser(c *gin.Context) {
	p := projectService.New()
	t := tableService.New()
	ts := taskService.New()
	db := database.DB
	user := c.MustGet("user").(*models.User)
	if param := c.Param("project_id"); param != "" {
		id, _ := strconv.Atoi(param)
		project, err := p.GetProjectByID(db, uint(id))
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		c.Set("project", project)
		if allowed := user.ID == project.UserID; !allowed {
			utils.Response(c, 403,
				"Forbidden",
				"Access not granted, Please login and attempt again",
				nil)
			c.Abort()
			return
		}
		c.Next()
	} else if param := c.Param("table_id"); param != "" {
		id, _ := strconv.Atoi(param)
		table, err := t.GetTableByID(db, uint(id))
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		c.Set("table", table)
		project, err := p.GetProjectByID(db, table.ProjectID)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		if allowed := user.ID == project.UserID; !allowed {
			utils.Response(c, 403,
				"Forbidden",
				"Access not granted, Please login and attempt again",
				nil)
			c.Abort()
			return
		}
		c.Next()
	} else if param := c.Param("task_id"); param != "" {
		id, _ := strconv.Atoi(param)
		task, err := ts.GetTaskByID(db, uint(id))
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		c.Set("task", task)
		table, err := t.GetTableByID(db, task.TableID)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		project, err := p.GetProjectByID(db, table.ProjectID)
		if err != nil {
			utils.Response(c, 500,
				"Internal Error",
				"",
				nil)
			c.Abort()
			return
		}
		if allowed := user.ID == project.UserID; !allowed {
			utils.Response(c, 403,
				"Forbidden",
				"Access not allowed, Bad infos",
				nil)
			c.Abort()
			return
		}
		c.Next()
	} else {
		utils.Response(c, 400,
			"Bad Request",
			"Wrong Parameters",
			nil)
		c.Abort()
		return
	}
}
