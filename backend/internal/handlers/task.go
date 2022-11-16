package handlers

import (
	"strconv"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	taskService "github.com/alireza/api/internal/services/task"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

type TaskRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func TaskPOST(c *gin.Context) {
	t := taskService.New()
	req := &TaskRequest{}

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		utils.Response(c, 500,
			"Internal Error",
			"Error while parsing JSON",
			nil)
		return
	}

	// Validating the request
	if errors := validators.TaskValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors,
		)
	}

	// Getting table's ID from the url
	param := c.Param("table_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Creating Task
	model := &models.Task{
		Name:        req.Name,
		Description: req.Description,
		TableID:     uint(id),
	}
	task, err := t.CreateTask(database.DB, *model)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"Task Created",
		task,
		nil)
}

func TaskGET(c *gin.Context) {
	t := taskService.New()

	// Getting table's Id from the url
	param := c.Param("table_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	tables, err := t.GetTasks(*database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		tables,
		nil)
}

func TaskDelete(c *gin.Context) {
	t := taskService.New()

	// Getting task's ID from the url
	param := c.Param("task_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	err = t.DeleteTask(*database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"", nil)
		return
	}

	utils.Response(c, 200,
		"Task Deleted",
		"",
		nil)
}
