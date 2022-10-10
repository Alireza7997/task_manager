package configs

type Config struct {
	Database                  Database `yaml:"database"`
	Host                      string   `yaml:"host"`
	Port                      string   `yaml:"port"`
	AllowOrigins              []string `yaml:"allow_origins"`
	SessionExpirySeconds      int64    `yaml:"session_expiry_seconds"`
	AccessTokenExpirySeconds  int64    `yaml:"access_token_expiry_seconds"`
	RefreshTokenExpirySeconds int64    `yaml:"refresh_token_expiry_seconds"`
	SecretKey                 []byte   `yaml:"secret_key"`
}

type Database struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	DBName   string `yaml:"dbname"`
}
