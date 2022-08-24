package configs

type Config struct {
	Database         Database `yaml:"database"`
	ExpireTokenAfter int64    `yaml:"expire_token_after"`
}

type Database struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	DBName   string `yaml:"dbname"`
}
