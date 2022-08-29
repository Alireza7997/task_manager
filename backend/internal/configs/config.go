package configs

type Config struct {
	Database         Database `yaml:"database"`
	Host             string   `yaml:"host"`
	Port             string   `yaml:"port"`
	ExpireTokenAfter int64    `yaml:"expire_token_after"`
	SecretKey        string   `yaml:"secret_key"`
}

type Database struct {
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	DBName   string `yaml:"dbname"`
}
