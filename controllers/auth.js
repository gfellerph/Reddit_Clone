exports.allowed = function (req, res, next) {

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
};

exports.stripPassword = function (req, res, next) {
	console.log(req.user.local.password);
	if(req.user.local.password) req.user.local.password = '';
	next();
};