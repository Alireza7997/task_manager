package models

import (
	"time"
)

var SessionName = "sessions"

type Session struct {
	SessionDetails
	ID     uint      `db:"id" goqu:"skipinsert" json:"id"`
	Expiry time.Time `db:"expiry" goqu:"skipupdate" json:"expiry"`
}

type SessionDetails struct {
	UserID    uint   `db:"user_id" json:"user_id"`
	SessionID string `db:"session_id" json:"session_id"`
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now())
}
