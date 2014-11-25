// Mounted on localhost:3000/presentation
// Hoodie, Azure, Firebase, Angular fire, parse.com, breeze, signalR
var express = require('express');
var router = express.Router();

module.exports = function () {

	// Login
	router.get('/', function (req, res) {
		res.render('../views/presentation/slide1.jade');
	});

	return router;
}