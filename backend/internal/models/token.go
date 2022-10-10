package models

var RefreshTokenName = "tokens"

type RefreshToken struct {
	Token string `db:"token" json:"token"`
}
