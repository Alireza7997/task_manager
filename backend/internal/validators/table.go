package validators

import "github.com/golodash/galidator"

var TableValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Title":       g.RuleSet("title").Required().Max(64),
	"Description": g.RuleSet("description").Max(200),
}))
