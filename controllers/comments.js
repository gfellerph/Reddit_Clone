var getOneComment;

var Datastore 	= require('nedb');
var path		= require('path');
var Comment 	= require('../models/comment');

//=====
// Initialize DB
//=====
var db	= new Datastore({
	filename: path.join(__dirname + '/../data/comments'),
	autoload: true
});

//=====
// Helper function to get a comment from DB
//=====
getOneComment = function (id, callback) {
	db.findOne({_id: id}, function (err, doc) {
		if (err) console.log(err);
		else callback(doc);
	});
};

//=====
// LIST
//=====
exports.list = function (req, res) {
	// Get all comments of one post
	db.find({postId: req.params.id}, function (err, doc){
		if (err) console.log(err);
		else res.json(doc);
	});
};

//=======
// CREATE
//=======
exports.create = function (req, res) {
	console.log(req.body);
	var c = new Comment(req.body);
	console.log(c);
	db.insert( new Comment(req.body), function (err, doc){
		if (err) console.log(err);
		else res.json(doc);
	});
}

//=====
// READ
//=====
exports.read = function (req, res) {
	getOneComment(req.params.id, function (user){
		res.json(user);
	});
};

//=======
// UPDATE
//=======
exports.update = function (req, res) {
	var updatedComment = new Comment(req.body);

	var update_rule = {
		$set: updatedComment
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
	db.remove({_id: req.params.id}, function (err, numRemoved) {
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

	db.update({_id: req.params.id}, update_rule, {}, function (err, numReplaced, doc) {
		if (err) console.log(err);
		else res.json(dco);
	});
};

//=========
// DOWNVOTE
//=========
exports.downvote = function (req, res){
	var update_rule = {
		$set: {
			'score.downvotes': req.body.score.downvotes
		}
	};

	db.update({_id: req.params.id}, update_rule, {}, function (err, numReplaced, doc){
		if (err) console.log(err);
		else res.json(doc);
	});
};