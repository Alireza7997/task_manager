package validators

import "github.com/golodash/galidator"

var Methods = []string{"jwt", "session"}

var LoginValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Username": g.RuleSet("username").Required().Min(5).Max(64),
	"Password": g.RuleSet("password").Required().Password().Max(100),
	"Method":   g.RuleSet("method").Required().Choices("jwt", "session"),
}))
