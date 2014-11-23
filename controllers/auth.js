exports.allowed = function isLoggedIn(req, res, next) {

	// Authenticated, execute next middleware
	if(req.isAuthenticated()) {
		return next();
	}

	console.log('No auth: sending ', req.originalUrl);
	// Not authenticated, send 401 with
	// URL to return to.
	var response = {
		returnTo: req.originalUrl
	}
	res.status(401);
	res.json(response);
}