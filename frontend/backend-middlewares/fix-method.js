// Return a token when
module.exports = (req, res, next) => {
	if (req.method === "POST" && req.path === "/token/1")
		res.jsonp({
			token: "sdadweqekdfsdojfejrqiroqirwi",
		});
	next();
};
