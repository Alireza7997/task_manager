package app

import (
	internalConfig "github.com/alireza/api/internal/configs"
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/pkg/config"
)

var configs = &internalConfig.Config{}

func init() {
	config.ReadLocalConfigs(configs)
	database.InitDataBase(&configs.Database)

}
