package validators

import "github.com/golodash/galidator"

var RefreshValidator = g.ComplexValidator(galidator.Rules{
	"Token": g.RuleSet("token").Required(),
})
