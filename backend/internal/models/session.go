package models

import (
	"time"

	"github.com/alireza/api/internal/utils"
)

var SessionName = "sessions"

type Session struct {
	ID        uint      `db:"id" goqu:"skipinsert"`
	UserID    uint      `db:"user_id" hide:"true"`
	SessionID string    `db:"session_id"`
	Expiry    time.Time `db:"expiry" goqu:"skipupdate" hide:"true"`
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now())
}

func (o *Session) Clean() interface{} {
	return utils.CleanStruct(o)
}
