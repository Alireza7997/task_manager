package app

import (
	"github.com/alireza/api/internal/database"
	"github.com/alireza/api/internal/global"
	"github.com/alireza/api/pkg/config"
)

func init() {
	config.ReadLocalConfigs(&global.CFG)
	database.InitDataBase(&global.CFG.Database)
}
