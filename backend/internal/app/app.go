package app

import (
	"log"

	_ "github.com/alireza/api/internal/app/load"
	"github.com/alireza/api/internal/routers"
	"github.com/gin-gonic/gin"
)

func Gin() {
	Router := gin.Default()
	routers.SetUpRouters(Router)

	err := Router.Run("localhost:9090")
	if err != nil {
		log.Fatal(err)
	}
}
