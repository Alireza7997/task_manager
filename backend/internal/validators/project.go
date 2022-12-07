package validators

import "github.com/golodash/galidator"

var ProjectValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Name": g.RuleSet("name").Required().Max(64),
}))

var ProjectPUTValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Name": g.RuleSet("name").Required().Max(64),
}))
