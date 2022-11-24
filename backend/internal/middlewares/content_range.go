package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func ContentRange(c *gin.Context) {
	c.Next()
	var (
		topic = c.MustGet("topic").(string)
		from  = c.MustGet("from").(int)
		to    = c.MustGet("to").(int)
		count = c.MustGet("count").(int)
	)
	c.Header("Content-Range", fmt.Sprintf("%s %d-%d/%d", topic, from, to, count))
	c.Header("Access-Control-Expose-Headers", "Content-Range")
	c.MustGet("send").(func())()
}
