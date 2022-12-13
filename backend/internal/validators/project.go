package validators

import "github.com/golodash/galidator"

var ProjectValidator = g.ComplexValidator(galidator.Rules{
	"Name": g.RuleSet("name").Required().Max(64),
})

var ProjectPUTValidator = g.ComplexValidator(galidator.Rules{
	"Name": g.RuleSet("name").Required().Max(64),
})
