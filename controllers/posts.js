var getOnePost;

var Datastore 	= require('nedb');
var path 		= require('path');
var Post 		= require('../models/post');
var User 		= require('../models/user');
var Vote 		= require('../models/vote');


//=====
// LIST
//=====
exports.list = function (req, res, next) {
	Post.find().populate('user', '-local.password').exec( function (err, posts) {
		if (err) return next(err);
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
	post.user = req.user._id;

	console.log(determineType(req.body.url));

	post.save( function (err) {
		if (err) return next(err);
		req.post = post;
		next();
	});
};

function determineType (url) {
	var imgRegex = new RegExp("(http(s?):)|([/|.|\w|\s])*\.(?:jp?g|png)");
	var gifRegex = new RegExp("(http(s?):)|([/|.|\w|\s])*\.(?:gif)")
	if (url.match(imgRegex)) { return 'image'; }
	if (url.match(gifRegex)) { return 'gif'; }
}

//=====
// READ
//=====
exports.read = function (req, res, next) {
	Post.findOne({_id: req.params.id})
		.populate('user', '-local.password')
		.exec( function (err, post) {
			if (err) console.log(err);
			req.post = post;
			next();
		}
	);
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