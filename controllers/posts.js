var mongoose 	= require('mongoose');
var Post 		= require('../models/post');
var User 		= require('../models/user');
var Vote 		= require('../models/vote');
var Comment 	= require('../models/comment');


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


//=============
// LIST BY USER
//=============
exports.listByUser = function (req, res, next) {
	Post.find({user: req.params.id})
	.populate('user', '-local.password')
	.exec( function (err, posts) {
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
	post.url = req.body.url || '';
	post.posted = Date.now();
	post.user = req.user._id;
	post.text = req.body.text || '';
	post.type = determineType(req.body.url, req.body.text);

	post.save( function (err, post) {
		if (err) return next(err);

		Post.findOne({_id: post.id})
		.populate('user', '-local.password')
		.exec( function (err, post) {

			// Hand post object to next middleware
			req.post = post;
			next();
		});
	});
};

function determineType (url, text) {
	if (!url || url == '') { return 'text'; }
	if (url != '' && text && text != '') return 'textandimage';
	if (url.indexOf('.jpg')>0 || url.indexOf('.png')>0 || url.indexOf('.gif')>0 || url.indexOf('.jpeg')>0) { return 'image'; }
	//if (url.indexOf('.gif')>0) { return 'gif'; }
	return 'none';
}

//=====
// READ
//=====
exports.read = function (req, res, next) {
	Post.findOne({_id: req.params.id})
		.populate('user', '-local.password')
		.exec( function (err, post) {
			req.post = post;
			next();
		}
	);
};

//=======
// UPDATE
//=======
exports.update = function (req, res, next) {

	// Get needed information from the request object
	var post = req.post || req.body;
	var id = post._id || req.params.id;

	Post.update(
		{
			_id: id
		}
		, {
			title: post.title
			,url: post.url || ''
			,text: post.text || ''
			,type: determineType(post.url, post.text)
			,votes: post.votes
			,comments: post.comments
		}
		, {}
		, function (err, num, raw) {
			if (err) return next(err);
			next();
		}
	);
};

//=======
// DELETE
//=======
exports.delete = function (req, res, next) {
	// Remove all comments to this post
	Comment.remove({post: req.params.id}, function (err) {
		if (err) next(err);

		// Remove the post
		Post.remove({_id: req.params.id}, function (err) {
			if (err) return next(err);
			next();
		});
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

			// If already upvoted, set to 0
			if (req.post.votes[i].vote == 1) req.post.votes[i].vote = 0;
			else req.post.votes[i].vote = 1;
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

	// Pass to next middleware
	return next();
};
exports.deleteVote = function (req, res, next) {
	var userId = req.user._id.toString();

	for (var i = 0; i < req.post.votes.length; i++) {
		if (req.post.votes[i].userId.toString() == userId) {
			req.post.votes[i].vote = 0;
			req.body = req.post;
			return next();
		}
	}

	console.log('Delete upvote: user vote not found');
	return next();
}

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

			// if already downvoted, set to 0
			if (req.post.votes[i].vote == -1) req.post.votes[i].vote = 0;
			else req.post.votes[i].vote = -1;
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

	// Pass to next middleware
	return next();
};