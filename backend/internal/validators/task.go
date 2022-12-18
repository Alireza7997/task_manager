package validators

import "github.com/golodash/galidator"

var TaskValidator = g.ComplexValidator(galidator.Rules{
	"Name":        g.RuleSet("name").Required().Max(64),
	"Description": g.RuleSet("description").Max(1000),
})

var TaskPUTValidator = g.ComplexValidator(galidator.Rules{
	"Name":        g.RuleSet("name").Max(64),
	"Description": g.RuleSet("description").Max(1000),
})

var TaskDRAGValidator = g.ComplexValidator(galidator.Rules{
	"CurrentPrev": g.RuleSet("current_prev").Required(),
	"Prev":        g.RuleSet("prev").Required(),
})
