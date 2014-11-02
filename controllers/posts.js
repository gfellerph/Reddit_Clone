var getOnePost;

var Datastore 	= require('nedb');
var path 		= require('path');
var Post 		= require('../models/post');

//=====
// Initialize DB
//=====
var db = new Datastore({
	filename: path.join(__dirname + '/../data/posts'),
	autoload: true
});

//=====
// Helper function to get one post
//=====
getOnePost = function (id, next) {
	db.findOne({'_id': id}, function (err, doc){
		if (err) console.log(err);
		else next(doc);
	});
};

//=====
// LIST
//=====
exports.list = function (req, res) {
	db.find({}, function (err, doc){
		if (err) console.log(err);
		else res.json(doc);
	});
};

//=======
// CREATE
//=======
exports.create = function (req, res) {
	db.insert( new Post(req.body), function (err, doc){
		if (err) console.log(err);
		else res.json(doc);
	});
};

//=====
// READ
//=====
exports.read = function (req, res) {
	getOnePost(req.params.id, function (post){
		res.json(post);
	});
};

//=======
// UPDATE
//=======
exports.update = function (req, res) {
	var updatedPost = new Post(req.body);

	var update_rule = {
		$set: updatedPost
	};

	db.update({_id: req.params.id}, update_rule, {}, function (err, numReplaced, doc) {
		if (err) console.log(err);
		else res.json(doc);
	});
};

//=======
// DELETE
//=======
exports.delete = function (req, res) {
	db.remove({ _id: req.params.id}, function (err, numRemoved) {
		if (err) console.log(err);
		else res.json({removed: numRemoved});
	});
};

//=======
// UPVOTE
//=======
exports.upvote = function (req, res) {
	var update_rule = {
		$set: {
			'score.upvotes': req.body.score.upvotes
		}
	};

	db.update({'_id': req.params.id}, update_rule, {}, function (err, numReplaced, doc) {
		if (err) console.log(err);
		else res.json(doc);
	});
};

//=========
// DOWNVOTE
//=========
exports.downvote = function (req, res) {
	var update_rule = {
		$set: {
			'score.downvotes': req.body.score.downvotes
		}
	};

	db.update({'_id': req.params.id}, update_rule, {}, function (err, numReplaced, doc) {
		if (err) console.log(err);
		else res.json(doc);
	});
};