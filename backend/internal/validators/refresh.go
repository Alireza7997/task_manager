package validators

import "github.com/golodash/galidator"

var RefreshValidator = g.Validator(galidator.Rules{
	"Token": g.RuleSet().Required(),
})
