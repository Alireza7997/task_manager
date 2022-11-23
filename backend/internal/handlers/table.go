package handlers

import (
	"strconv"

	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/models"
	tableService "github.com/alireza/api/internal/services/table"
	"github.com/alireza/api/internal/utils"
	"github.com/alireza/api/internal/validators"
	"github.com/gin-gonic/gin"
)

type TableRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func TablePOST(c *gin.Context) {
	req := &TableRequest{}
	t := tableService.New()

	// Parsing JSON
	if !utils.ParseJson(req, c) {
		utils.Response(c, 500,
			"Internal Error",
			"Error while parsing JSON",
			nil)
		return
	}

	// Validating the request
	if errors := validators.TableValidator.Validate(*req); errors != nil {
		utils.Response(c, 400,
			"Invalid request",
			"Fields are not filled properly",
			errors)
		return
	}

	// Getting project's ID from url
	param := c.Param("project_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Creating a table
	model := &models.Table{
		Title:       req.Title,
		Description: req.Description,
		ProjectID:   uint(id),
	}

	table, err := t.CreateTable(database.DB, *model)
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"Table Created",
		table,
		nil)

}

func TableGET(c *gin.Context) {
	t := tableService.New()

	// Getting project's ID from url
	param := c.Param("project_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Getting Tables from database
	tables, err := t.GetTables(database.DB, uint(id))
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

func TableDelete(c *gin.Context) {
	t := tableService.New()

	// Getting table's ID from url
	param := c.Param("table_id")
	id, err := strconv.Atoi(param)
	if err != nil {
		utils.Response(c, 400,
			"Bad URL",
			"",
			nil)
		return
	}

	// Deleting table
	err = t.DeleteTable(database.DB, uint(id))
	if err != nil {
		utils.Response(c, 500,
			"Internal Error",
			"",
			nil)
		return
	}

	utils.Response(c, 200,
		"Table Deleted",
		"",
		nil)
}
