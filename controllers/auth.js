exports.allowed = function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.render('../views/auth/login');
}