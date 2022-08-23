package models

import (
	"time"
)

var SessionName = "sessions"

type Session struct {
	ID        uint      `db:"id" goqu:"skipinsert"`
	UserID    uint      `db:"user_id"`
	SessionID string    `db:"session_id"`
	Expiry    time.Time `db:"expiry" goqu:"skipupdate"`
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now())
}
