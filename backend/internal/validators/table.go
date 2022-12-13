package validators

import "github.com/golodash/galidator"

var TableValidator = g.ComplexValidator(galidator.Rules{
	"Title":       g.RuleSet("title").Required().Min(1).Max(64),
	"Description": g.RuleSet("description").Max(200),
})

var TablePUTValidator = g.ComplexValidator(galidator.Rules{
	"Title":       g.RuleSet("title").Required().Min(1).Max(64),
	"Description": g.RuleSet("description").Max(200),
})
