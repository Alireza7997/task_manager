package models

import (
	"time"
)

var SessionName = "sessions"

type Session struct {
	SessionDetails
	ID     uint      `db:"id" goqu:"skipinsert"`
	Expiry time.Time `db:"expiry" goqu:"skipupdate"`
}

type SessionDetails struct {
	UserID    uint   `db:"user_id"`
	SessionID string `db:"session_id"`
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now())
}
