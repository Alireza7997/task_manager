package validators

import "github.com/golodash/galidator"

var ProjectValidator = g.Validator(galidator.Rules{
	"Name": g.RuleSet().Required().Max(64),
})
