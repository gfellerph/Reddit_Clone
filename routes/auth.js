// Mounted on localhost:3000/auth
// Hoodie, Azure, Firebase, Angular fire, parse.com, breeze, signalR
var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	// Login
	router.get('/', function (req, res) {
		res.render('../views/auth/login.jade');
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/posts',
		failureRedirect: '/404',
		failureFlash: true
	}));

	// Register
	router.get('/register', function (req, res) {
		res.render('../views/auth/register.jade');
	});

	router.post('/register', passport.authenticate('registration', {
		successRedirect: '/posts',
		failureRedirect: '/404',
		failureFlash: true
	}));


	// Logout
	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/posts');
	});

	return router;
}