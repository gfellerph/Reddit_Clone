var getOneUser;
var isValidPassword;
var createHash;
var respond;

var Datastore 		= require('nedb');
var path 			= require('path');
var passport 		= require('passport');
var LocalStrategy 	= require('passport-local');
var bCrypt			= require('bcrypt-nodejs');
var User 			= require('../models/user');

//=====
// Initialize DB
//=====
var db = new Datastore({
	filename: path.join(__dirname + '/../data/users'),
	autoload: true
});

//=====
// Helper functions
//=====

// Handle DB responses
respond = function (err, doc, req, res, next) {

	// Pass the error to the express error handler (error from db)
	if (err) next(err);

	// DB responded with nothing, pass error to handler
	if (!doc) next('User controller: respond. No results from db.');

	// Attach db response to req and pass to next middleware
	req.result = doc;
	next();
};
isValidPassword = function (user, password) {
	return bCrypt.compareSync(password, user.password);
}
createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
// Not express middleware read one
exports.readOne = function (username, next) {
	db.findOne({'username': username}, next);
}

exports.createOne = function (user, next) {
	db.insert(user, next);
}

//=====
// LIST
//=====
exports.list = function (req, res, next) {
	db.find({}, function (err, doc){
		respond(err, doc, req, res, next);
	});
};

//=======
// CREATE
//=======
exports.create = function (req, res, next) {
	db.insert( new User(req.body), function (err, doc){
		respond(err, doc, req, res, next);
	});
};

//=====
// READ
//=====
exports.read = function (req, res, next) {
	db.findOne({'_id': id}, function (err, doc){
		respond(err, doc, req, res, next);
	});
};

//=======
// UPDATE
//=======
exports.update = function (req, res, next) {
	var updatedUser = new User(req.body);

	var update_rule = {
		$set: updatedUser
	};

	db.update({_id: req.params.id}, update_rule, {}, function (err, numReplaced, doc) {
		respond(err, doc, req, res, next);
	});
};

//=======
// DELETE
//=======
exports.delete = function (req, res, next) {
	db.remove({ _id: req.params.id}, function (err, doc) {
		respond(err, doc, req, res, next);
	});
};

//======
// LOGIN
//======

passport.use('login', new LocalStrategy({
	passReqToCallback: true
},
function (req, username, password, done) {
	db.findOne({username: username}, function (err, user) {
		if (err) return done(err);
		if (!user) {
			console.log('User not found with username ' + username);
			return done(null, false, req.flash('message', 'User not found.'));
		}
		if (!isValidPassword(user, password)) {
			console.log('Invalid Password');
			return done(null, false, req.flash('message', 'Invalid password'));
		}

		return done(null, user);

	});
}));

passport.use('signup', new LocalStrategy({
	passReqToCallback: true
},
function (req, username, password, done) {
	findOrCreateUser = function () {
		db.findOne({username: username}, function (err, user) {
			if (err) {
				console.log(err);
				return done(err);
			}

			if (user) {
				console.log('User already exists');
				return done(null, false, req.flash('message', 'User already exists'));
			} else {
				var newUser = new User({
					username: username,
					password: createHash(password),
					email: req.param('email')
				});

				db.insert(newUser, function (err, user) {
					if (err) console.log(err);
					else return done(null, user);
				});
			}
		});
	};
}));