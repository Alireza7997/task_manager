package app

import (
	"fmt"
	"log"

	_ "github.com/alireza/api/internal/app/load"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/routers"
	"github.com/gin-gonic/gin"
)

func Gin() {
	Router := gin.Default()
	routers.SetUpRouters(Router)

	err := Router.Run(fmt.Sprintf("%s:%s", global.CFG.Host, global.CFG.Port))
	if err != nil {
		log.Fatal(err)
	}
}
