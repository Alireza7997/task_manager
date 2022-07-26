package main

import (
	"log"

	"github.com/alireza/backend/pkg/database"
	"github.com/alireza/backend/pkg/handlers"
	"github.com/gin-gonic/gin"
)

func main() {
	// creating an engine
	router := gin.Default()
	router.LoadHTMLGlob("D:/Projects/collaboral_frontend_backend/backend/templates/*.html")

	// setting up routers

	// authentication middleware
	// authRouter := router.Group("/user", middleware.Auth)
	// authRouter.GET("/me", handlers.Me)
	// authRouter.GET("/logout", handlers.Logout)

	router.GET("/", handlers.IndexHandler)
	router.GET("/register", handlers.GetRegister)
	router.POST("/register", handlers.PostRegister)
	router.GET("/login", handlers.GetLogin)
	router.POST("/login", handlers.PostLogin)
	database.InitDataBase()
	err := router.Run("localhost:9090")
	if err != nil {
		log.Fatal(err)
	}
	defer database.DB.Close()
}
