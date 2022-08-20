package database

import (
	"database/sql"
	"fmt"
	"log"

	internalConfig "github.com/alireza/api/internal/configs"
	"github.com/doug-martin/goqu/v9"
	migrate "github.com/rubenv/sql-migrate"

	_ "github.com/doug-martin/goqu/v9/dialect/postgres"
	_ "github.com/lib/pq"
)

var db *sql.DB
var DB *goqu.Database

func InitDataBase(database *internalConfig.Database) {
	var err error
	db, err = sql.Open("postgres",
		fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable TimeZone=Asia/Tehran",
			database.Host, database.Port, database.Username, database.DBName, database.Password))
	if err != nil {
		log.Fatal(err)
	}
	DB = goqu.New("postgres", db)
	migrateLatestChanges(db)
}

func migrateLatestChanges(db *sql.DB) {
	migrations := &migrate.FileMigrationSource{
		Dir: "migrations/",
	}
	n, err := migrate.Exec(db, "postgres", migrations, migrate.Up)
	if err != nil {
		log.Fatalln(err)
	}
	if n > 0 {
		fmt.Println("\n==Migrations==")
		fmt.Printf("Applied %d migrations!\n", n)
	}
}
