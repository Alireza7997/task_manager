package handlers

import (
	"fmt"
	"strconv"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	projectService "github.com/alireza/api/internal/services/project"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

type ProjectRequest struct {
	Name string `json:"name"`
}

func ProjectPOST(c *gin.Context) {
	req := &ProjectRequest{}
	p := projectService.New()

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		utils.Response(c, 500,
			"Internal Error",
			"Error while parsing JSON",
			nil)
		return
	}

	// Validating the request
	if errors := validators.ProjectValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors)
		return
	}

	// Getting user from the header
	user := c.MustGet("user").(*models.User)
	fmt.Println(user)

	// Creating a project
	model := models.Project{
		Name:   req.Name,
		UserID: user.ID,
	}

	project, err := p.CreateProject(database.DB, model)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"Project Created",
		project,
		nil)
}

func ProjectGETALL(c *gin.Context) {
	p := projectService.New()

	// Getting user from the header
	user := c.MustGet("user").(*models.User)

	// Getting project from database bu user's ID
	projects, err := p.GetProjects(database.DB, user.ID)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		projects,
		nil)
}

func ProjectGET(c *gin.Context) {
	p := projectService.New()

	//Getting project's ID from the url
	param := c.Param("project_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	//Getting project from the database by ID
	project, err := p.GetProjectByID(database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"",
		project,
		nil)
}

func ProjectDelete(c *gin.Context) {
	p := projectService.New()

	// Getting ID from the url
	param := c.Param("project_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Deleting Project
	err = p.DeleteProject(database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
	}

	utils.Response(c, 200,
		"Project Deleted",
		"",
		nil)
}
