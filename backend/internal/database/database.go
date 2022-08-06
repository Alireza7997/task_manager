package database

import (
	"log"

	"github.com/alireza/api/internal/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func InitDataBase() {
	var err error
	DB, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=Website1 password=09116903138a sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	DB.AutoMigrate(&models.User{})
}
