var User 		= require('../models/user');
var userCtrl 	= require('./users');



module.exports = function () {

	var checkauth;
	var init;
	var serialize;
	var deserialize;

	// Serialize user for passport
	serialize = function (passport) {
		passport.serializeUser( function (user, next) {
			console.log('Auth controller: serialize. User: ');
			console.log(user);
			next(null, user._id);
		});
	};

	// Deserialize user for passport
	deserialize = function (passport) {
		passport.deserializeUser( function (id, next) {
			userCtrl.readOne(id, function (err, user) {
				console.log('Auth controller: deserialize. User:');
				console.log(user);
				next(err, user);
			});
		});
	}

	// Initialize passport
	init = function (passport) {

	};

	// Middleware to authenticate a user
	checkauth = function (req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/auth');
	};

	// Export set of functions
	return {
		initialize: init
		,isAuthenticated: checkauth
	}
}