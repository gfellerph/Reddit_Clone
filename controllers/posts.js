
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
	post.text = req.body.text;
	post.type = determineType(req.body.url);
	console.log(determineType(req.body.url));

	post.save( function (err) {
		if (err) return next(err);
		req.post = post;
		next();
	});
};

function determineType (url) {
	if (!url || url == '') { return 'text'; }
	if (url.indexOf('.jpg')>0 || url.indexOf('.png')>0) { return 'image'; }
	if (url.indexOf('.gif')>0) { return 'gif'; }
	return 'none';
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
exports.delete = function (req, res, next) {
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