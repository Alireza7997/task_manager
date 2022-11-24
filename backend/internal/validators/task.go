package validators

import "github.com/golodash/galidator"

var TaskValidator = g.Validator(galidator.Rules{
	"Name":        g.RuleSet().Required().Max(64),
	"Description": g.RuleSet().Max(1000),
})
