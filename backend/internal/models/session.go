package models

import (
	"time"
)

type Session struct {
	User_name string `gorm:"primary_key;unique"`
	SessionID string
	Expiry    time.Time
}

func (s *Session) IsExpired() bool {
	return s.Expiry.Before(time.Now())
}
