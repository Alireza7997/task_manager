package database

import (
	"log"

	"github.com/alireza/backend/pkg/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// creating (gorm)database
var DB *gorm.DB

// connects (gorm)database to PostgreSQL Database
func InitDataBase() {
	var err error
	DB, err = gorm.Open("postgres", "host=localhost port=5432 user=postgres dbname=Website1 password=09116903138a sslmode=disable")
	if err != nil {
		panic("failed to connect to database")
	}
	log.Println("Connected to database")
	DB.AutoMigrate(&models.User{})
	log.Println("Database Migrated")
}
