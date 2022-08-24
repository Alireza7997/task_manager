package validators

import "github.com/golodash/galidator"

var LoginValidator = g.Validator(galidator.Rules{
	"Username": g.RuleSet().Min(5).Max(64).Regex(`^(\w|\d|\s|_|-)+$`),
	"Password": g.RuleSet().Password().Max(100),
})
