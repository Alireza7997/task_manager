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

type (
	TaskRequest struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	TaskUpdate struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	TaskDrag struct {
		CurrentPrev uint `json:"current_prev"`
		Prev        uint `json:"prev"`
	}
)

func TaskPOST(c *gin.Context) {
	t := taskService.New()
	req := &TaskRequest{}

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		return
	}

	// Validating the request
	if errors := validators.TaskValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors,
		)
		return
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
		Next:        0,
	}
	task, err := t.CreateTask(database.DB, *model)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			err.Error())
		return
	}

	utils.Response(c, 200,
		"Task Created",
		task,
		nil)
}

func TaskGETALL(c *gin.Context) {
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

	tasks, err := t.GetTasks(database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		tasks,
		nil)
}

func TaskGET(c *gin.Context) {
	t := taskService.New()

	//Getting task's ID from the url
	param := c.Param("task_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	//Getting task form the database by ID
	task, err := t.GetTaskByID(database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		task,
		nil)
}

func TaskDELETE(c *gin.Context) {
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

	err = t.DeleteTask(database.DB, uint(id))
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

func TaskPUT(c *gin.Context) {
	req := &TaskUpdate{}
	t := taskService.New()

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		return
	}

	// Validating the request
	if errors := validators.TaskPUTValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors,
		)
		return
	}

	// Getting the task from the context
	task := c.MustGet("task").(*models.Task)

	// Updating the task based on the changes made
	newTask, err := t.UpdateTask(database.DB, task.ID, req.Name, req.Description)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		newTask,
		nil)
}

func DragAndDrop(c *gin.Context) {
	t := taskService.New()
	req := &TaskDrag{}

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		return
	}

	// Validating the request
	if errors := validators.TaskDRAGValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors,
		)
		return
	}

	// Getting table and task ID from the url
	param := c.Param("task_id")
	param2 := c.Param("table_id")
	taskID, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}
	tableID, err := strconv.Atoi(param2)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Moving the task
	err = t.DragDrop(database.DB, uint(taskID), uint(tableID), req.CurrentPrev, req.Prev)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			err.Error(),
			nil)
		return
	}

	utils.Response(c, 200,
		"Task Moved",
		"",
		nil)
}
