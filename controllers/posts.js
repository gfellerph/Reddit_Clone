var Datastore = require('nedb');
var path = require('path');
var db = new Datastore({ filename: path.join(__dirname + '/../data/posts'), autoload: true });
var getOnePost;

// Helper function to get one post
getOnePost = function (id, next){
	db.findOne({'_id': id}, function (err, doc){
		if (err){ console.log(err); }
		else { next(doc); }
	});
};

// Get all posts
exports.getAll = function (req, res){
	db.find({}, function (err, doc){
		if (err){ console.log(err); }
		else { res.json(doc); }
	});
};

// Get one post
exports.getOne = function (req, res){
	getOneUser(req.params.id, function (user){
		res.json(user);
	});
};

// Add a post
exports.add = function (req, res){
	db.insert({
		title: req.body.title,
		text: req.body.text,
		image: req.body.image,
		posted: req.body.posted,
		score: {
			upvotes: req.body.upvotes,
			downvotes: req.body.downvotes
		},
		user: {
			name: req.body.name,
			joined: req.body.joined
		}
	}, function (err, doc){
		if (err){ console.log(err); }
		else { res.json(doc); }
	});
};

// Update one post
exports.update = function (req, res){
	var update_rule = {
		$set: {
			title: req.body.title,
			text: req.body.text,
			image: req.body.image,
			posted: req.body.posted,
			score: {
				upvotes: req.body.upvotes,
				downvotes: req.body.downvotes
			},
			user: {
				name: req.body.name,
				joined: req.body.joined
			}
		}
	};

	db.update({'_id': req.params.id}, update_rule, {}, function (err, numReplaced, newDoc){
		if (err){ console.log(err); }
		else { res.json(newDoc); }
	});
};

// Delete one post
exports.delete = function (req, res){
	db.remove({ _id: req.params.id}, function (err, numRemoved) {
		if (err){ console.log(err); }
		else { res.json({removed: numRemoved}); }
	});
};