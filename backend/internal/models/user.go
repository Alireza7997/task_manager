package models

import "time"

type User struct {
	Username  string `json:"username" gorm:"primaryKey"`
	Password  string `json:"password"`
	Email     string `json:"email"`
	CreatedAt time.Time
}
