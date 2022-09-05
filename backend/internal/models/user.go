package models

import (
	"time"
)

var UserName string = "users"

type User struct {
	UserDetails
	ID       uint   `db:"id" goqu:"skipinsert" json:"id"`
	Password string `db:"password" json:"password"`
}

type UserDetails struct {
	Username  string    `db:"username" json:"username"`
	Email     string    `db:"email" json:"email"`
	CreatedAt time.Time `db:"created_at" goqu:"skipupdate" json:"created_at"`
}
