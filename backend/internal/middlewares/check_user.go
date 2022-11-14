package middleware

// import (
// 	"strconv"

// 	"github.com/alireza/api/internal/models"
// 	projectService "github.com/alireza/api/internal/services/project"
// 	"github.com/alireza/api/internal/utils"
// 	"github.com/gin-gonic/gin"
// )

// func CheckUser(c *gin.Context) {
// 	user := c.MustGet("user").(*models.User)
// 	param := c.Param("id")
// 	id, err := strconv.Atoi(param)
// 	if err != nil {
// 		utils.Response(c, 500,
// 			"Internal Error",
// 			"",
// 			nil)
// 	}

// 	param = c.Params.ByName("projects")
// 	if param == "" {
// 		param = c.Params.ByName("tables")
// 		if param == "" {
// 			param = c.Params.ByName("tasks")
// 		}
// 	}

// 	switch param {
// 	case "projects":
// 	}
// }
