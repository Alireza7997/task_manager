package validators

import "github.com/golodash/galidator"

var LoginValidator = g.Validator(galidator.Rules{
	"Username": g.RuleSet().Required().Min(5).Max(64),
	"Password": g.RuleSet().Required().Password().Max(100),
	"Method":   g.RuleSet().Required().Choices([]string{"jwt", "session"}),
})
