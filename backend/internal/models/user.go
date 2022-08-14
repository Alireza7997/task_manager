package models

import "time"

type User struct {
	Username  string `gorm:"primary_key;unique"`
	Password  string
	Email     string `gorm:"unique"`
	CreatedAt time.Time
}
