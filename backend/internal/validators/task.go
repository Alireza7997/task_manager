package validators

import "github.com/golodash/galidator"

var TaskValidator = g.Validator(galidator.Rules{
	"Name":        g.RuleSet().Required().Min(1).Max(64),
	"Description": g.RuleSet().Required().Min(1).Max(1000),
})
