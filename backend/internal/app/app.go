package app

import (
	"fmt"
	"log"

	_ "github.com/alireza/api/internal/app/load"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/internal/routers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golodash/godash/slices"
)

func config(router *gin.Engine) {
	config := cors.DefaultConfig()
	config.AllowOriginFunc = func(input string) bool {
		return slices.FindIndex(global.CFG.AllowOrigins, input) != -1
	}
	config.AllowHeaders = append(config.AllowHeaders, "session_id", "jwt")
	router.Use(cors.New(config))
}

func Gin() {
	gin.SetMode(gin.ReleaseMode)
	Router := gin.Default()
	config(Router)
	routers.SetUpRouters(Router)

	err := Router.Run(fmt.Sprintf("%s:%s", global.CFG.Host, global.CFG.Port))
	if err != nil {
		log.Fatal(err)
	}
}
