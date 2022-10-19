// Adds headers that make frontend pagination possible
module.exports = (req, res, next) => {
	if (req.path === "/projects") {
		res.header("Content-Range", "projects 0-20/20");
		res.header("Access-Control-Expose-Headers", "Content-Range");
	}
	next();
};
