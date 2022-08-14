package database

import (
	"fmt"
	"log"

	internalConfig "github.com/alireza/api/internal/configs"
	"github.com/alireza/api/internal/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func InitDataBase(cfg *internalConfig.Database) {
	var err error
	DB, err = gorm.Open("postgres",
		fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
			cfg.Host, cfg.Port, cfg.Username, cfg.DBName, cfg.Password))
	if err != nil {
		log.Fatal(err)
	}
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Session{})
}

func UserExists(username, email string) bool {
	finder := DB.Exec("SELECT username FROM users WHERE username = ? OR email = ?", username, email)
	return finder.RowsAffected == 1
}

func SessionExists(username string) bool {
	sessionFinder := DB.Exec("SELECT * FROM sessions WHERE user_name = ?", username)
	return sessionFinder.RowsAffected == 1
}
