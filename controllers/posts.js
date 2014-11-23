var getOnePost;

var Datastore 	= require('nedb');
var path 		= require('path');
var Post 		= require('../models/post');
var User 		= require('../models/user');
var Vote 		= require('../models/vote');

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
exports.list = function (req, res, next) {
	Post.find( function (err, posts) {
		if (err) throw err;
		req.posts = posts;
		next();
	});
};

//=======
// CREATE
//=======
exports.create = function (req, res, next) {
	var post = new Post();

	post.title = req.body.title;
	post.url = req.body.url;
	post.posted = Date.now();
	post.user = req.user;

	post.save( function (err) {
		if (err) throw err;
		req.post = post;
		next();
	});
};

//=====
// READ
//=====
exports.read = function (req, res, next) {
	Post.findOne({_id: req.params.id}, function (err, post) {
		if (err) throw err;
		req.post = post;
		next();
	});
};

//=======
// UPDATE
//=======
exports.update = function (req, res, next) {
	Post.update(
		{
			_id: req.params.id
		}
		, {
			title: req.body.title
			,url: req.body.url
			,votes: req.body.votes
		}
		, {}
		, function (err, post) {
			if (err) throw err;
			req.post = post;
			next();
		}
	);
};

//=======
// DELETE
//=======
exports.delete = function (req, res) {
	Post.remove({_id: req.params.id}, function (err) {
		if (err) throw err;
		next();
	});
};

//=======
// UPVOTE
//=======
exports.upvote = function (req, res, next) {

	// Check if user has already voted
	var hasVoted = false;
	var userId = req.user._id.toString();

	for(var i = 0; i < req.post.votes.length; i++) {
		if(req.post.votes[i].userId.toString() == userId) {
			hasVoted = true;
			req.post.votes[i].vote = 1;
		}
	}

	if (!hasVoted) {

		// Create new vote
		var vote = new Vote();

		vote.userId = req.user._id;
		vote.vote = 1;

		// Add vote
		req.post.votes.push(vote);
	}

	// Enable update middleware to access the new post
	req.body = req.post;

	// Pass to next middleware
	return next();
};

//=========
// DOWNVOTE
//=========
exports.downvote = function (req, res, next) {

	// Check if user has already voted
	var hasVoted = false;
	var userId = req.user._id.toString();

	for(var i = 0; i < req.post.votes.length; i++) {
		if(req.post.votes[i].userId.toString() == req.user._id) {
			hasVoted = true;
			req.post.votes[i].vote = -1;
		}
	}

	if (!hasVoted) {

		// Create new vote
		var vote = new Vote();

		vote.userId = req.user._id;
		vote.vote = -1;

		// Add vote
		req.post.votes.push(vote);
	}

	// Enable update middleware to access the new post
	req.body = req.post;

	// Pass to next middleware
	return next();
};