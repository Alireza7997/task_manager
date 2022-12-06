package validators

import (
	"github.com/alireza/api/internal/database"
	userService "github.com/alireza/api/internal/services/user"
	"github.com/golodash/galidator"
)

var RegisterValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Username": g.RuleSet("username").Required().Min(5).Max(64).Regex(`^(\w|\d|\s|_|-)+$`).Custom(galidator.Validators{"DuplicateUsername": DuplicateUsername}),
	"Email":    g.RuleSet("email").Required().Email().Max(320).Custom(galidator.Validators{"DuplicateEmail": DuplicateEmail}),
	"Password": g.RuleSet("password").Required().Password().Max(100),
}), galidator.Messages{
	"DuplicateUsername": "$value already exists",
	"DuplicateEmail":    "$value already exists",
})

func DuplicateUsername(input interface{}) bool {
	return !userService.New().UserExistsByUsername(database.DB, input.(string))
}

func DuplicateEmail(input interface{}) bool {
	return !userService.New().UserExistsByEmail(database.DB, input.(string))
}
