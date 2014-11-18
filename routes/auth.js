// Mounted on localhost:3000/auth
// Hoodie, Azure, Firebase, Angular fire, parse.com, breeze, signalR
var express = require('express');
var router = express.Router();

module.exports = function (passport) {

	// Login
	router.get('/', function (req, res) {
		res.render('../views/auth/login.jade');
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/404',
		failureFlash: true
	}));

	// Register
	router.get('/register', function (req, res) {
		res.render('../views/auth/register.jade');
	});

	router.post('/register', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/auth/register',
		failureFlash: true
	}));


	// Logout
	router.get('/logout', function (req, res) {
		req.logout();
		res.render('../views/posts/post-list.jade');
	});

	//===================
	// Angular directives
	//===================
	router.get('/header', function (req, res) {
		console.log(req.user);
		res.render('../views/auth/header.jade', {user: req.user, loggedIn: req.isAuthenticated()});
	});

	return router;
}