package models

import (
	"time"
)

var UserName string = "users"

type User struct {
	UserDetails
	ID       uint   `db:"id" goqu:"skipinsert"`
	Password string `db:"password"`
}

type UserDetails struct {
	Username  string    `db:"username"`
	Email     string    `db:"email"`
	CreatedAt time.Time `db:"created_at" goqu:"skipupdate"`
}
