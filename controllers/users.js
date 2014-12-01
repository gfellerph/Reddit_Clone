var mongoose 	= require('mongoose');
var User = require('../models/user');

exports.getUser = function (req, res) {
	if (!req.user) req.user = false;
	res.json( req.user );
};

exports.getUserById = function (req, res, next) {
	User.findOne({_id: req.params.id})
	.exec( function (err, user) {
		req.userById = user;
		next();
	});
};