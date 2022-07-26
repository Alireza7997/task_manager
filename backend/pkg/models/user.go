package models

import (
	"github.com/jinzhu/gorm"
)

// User model to be used in database
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"primaryKey"`
	Password string `json:"password" gorm:"not null"`
	PassHash []byte `json:"passhash"`
	Email    string `json:"email" gorm:"unique;not null"`
}
