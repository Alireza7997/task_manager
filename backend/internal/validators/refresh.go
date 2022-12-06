package validators

import "github.com/golodash/galidator"

var RefreshValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Token": g.RuleSet("token").Required(),
}))
