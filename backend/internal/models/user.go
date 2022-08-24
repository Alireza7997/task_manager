package models

import (
	"time"

	"github.com/alireza/api/internal/utils"
)

var UserName string = "users"

type User struct {
	ID        uint      `db:"id" goqu:"skipinsert"`
	Username  string    `db:"username"`
	Password  string    `db:"password" hide:"true"`
	Email     string    `db:"email"`
	CreatedAt time.Time `db:"created_at" goqu:"skipupdate"`
}

func (o *User) Clean() interface{} {
	return utils.CleanStruct(o)
}
