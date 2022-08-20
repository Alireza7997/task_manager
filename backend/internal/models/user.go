package models

import "time"

var UserName string = "users"

type User struct {
	ID        uint      `db:"id" goqu:"skipinsert"`
	Username  string    `db:"username"`
	Password  string    `db:"password"`
	Email     string    `db:"email"`
	CreatedAt time.Time `db:"created_at" goqu:"skipupdate"`
}
