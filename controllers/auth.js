var User 			= require('../models/user');
var userCtrl 		= require('./users');
var login 			= require('./login');
var registration 	= require('./registration');



module.exports = function (passport){

	var checkauth;
	var init;
	var serialize;
	var deserialize;
	var isvalid;

	// Check if password is valid
	

	// Serialize user for passport
	passport.serializeUser( function (user, next) {
		console.log('Auth controller: serialize. User: ');
		console.log(user);
		next(null, user._id);
	});

	// Deserialize user for passport
	passport.deserializeUser( function (id, next) {
		userCtrl.readOne(id, function (err, user) {
			console.log('Auth controller: deserialize. User:');
			console.log(user);
			next(err, user);
		});
	});

	// Middleware to authenticate a user
	checkauth = function (req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/auth');
	};

	login(passport);
	registration(passport);
}