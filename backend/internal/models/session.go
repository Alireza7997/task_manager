package models

import (
	"time"
)

var SessionName = "sessions"

type Session struct {
	ID        uint
	SessionID string `gorm:"unique"`
	Expiry    time.Time
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now().Local())
}
