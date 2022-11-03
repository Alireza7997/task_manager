package validators

import "github.com/golodash/galidator"

var TableValidator = g.Validator(galidator.Rules{
	"Title":       g.RuleSet().Required().Min(1).Max(64),
	"Description": g.RuleSet().Required().Min(1).Max(200),
})
