var Datastore = require('nedb');
var path = require('path');
var db = new Datastore({ filename: path.join(__dirname + '/../data/test'), autoload: true });
var getOneUser;

getOneUser = function(id, callback){
	db.findOne({'_id': id}, function (err, doc){
		if (err){
			console.log(err);
		} else {
			callback(doc);
		}
	});
}

exports.list = function (req, res){
	db.find({}, function (err, doc){
		if (err){
			console.log(err);
		} else {
			res.render('../views/test/list', {userlist: doc});
		}
	});
}

exports.add = function (req, res){

	var userName = req.body.username;
	var userEmail = req.body.useremail;

	db.insert({
		'username': userName,
		'useremail': userEmail
	}, function (err, newDoc){
		if (err){
			console.log(err);
		}

		res.location('list');
		res.redirect('list');
	});
}

exports.one = function (req, res){
	getOneUser(req.params.id, function (user){
		res.render('../views/test/one', { title: 'One User', user: user });
	});
}

exports.updateForm = function (req, res){
	getOneUser(req.params.id, function (user){
		res.render('../views/test/update', { title: 'Update User', user: user });
	});
}

exports.update = function (req, res){
	var update_rule = {
		$set: {
			username: req.body.username,
			useremail: req.body.useremail
		}
	};

	db.update({'_id': req.params.id}, update_rule, {}, function (err, numReplaced, newDoc){
		if (err){
			console.log(err);
		}
		res.location('/test/list');
		res.redirect('/test/list');
	});
}