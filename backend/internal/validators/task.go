package validators

import "github.com/golodash/galidator"

var TaskValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Name":        g.RuleSet("name").Required().Max(64),
	"Description": g.RuleSet("description").Required().Max(1000),
}))

var TaskPUTValidator = g.Validator(g.R().Complex(galidator.Rules{
	"Name":        g.RuleSet("name").Required().Max(64),
	"Description": g.RuleSet("description").Required().Max(1000),
}))

var TaskDRAGValidator = g.Validator(g.R().Complex(galidator.Rules{
	"CurrentPrev": g.RuleSet("current_prev").Required(),
	"Prev":        g.RuleSet("prev").Required(),
}))
