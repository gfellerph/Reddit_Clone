
var Comment 	= require('../models/comment');
var Vote 		= require('../models/vote');


//=====
// LIST
//=====
exports.list = function (req, res, next) {
	// Get all comments of one post
	Comment.find()
	.populate('user', '-local.password')
	.exec( function (err, comments){
		if (err) return next(err);
		req.comments = comments;
		next();
	});
};

//=====
// READ
//=====
exports.read = function (req, res, next) {
	Comment.findOne({_id: req.params.id})
	.populate('user', '-local.password')
	.exec( function (err, comment) {
		if (err) next(err);
		req.comment = comment;
		next();
	});
};

//=======
// CREATE
//=======
exports.create = function (req, res, next) {
	var comment = new Comment();

	comment.text = req.body.text;
	comment.user = req.user._id;

	comment.save( function (err) {
		if (err) return next(err);
		req.comment = comment;
		next();
	});
};

//=======
// UPDATE
//=======
exports.update = function (req, res, next) {
	Comment.update(
		{
			_id: req.params.id
		}
		, {
			text: req.body.text,
			votes: req.body.votes
		}
		, {}
		, function (err, comment) {
			if (err) next(err);
			req.comment = comment;
			next();
		}
	);
};

//=======
// DELETE
//=======
exports.delete = function (req, res, next) {
	Comment.remove({_id: req.params.id}, function (err) {
		if (err) next(err);
	})
};

//=======
// UPVOTE
//=======
exports.upvote = function (req, res, next) {
	
	// Check if user has already voted
	var hasVoted = false;
	var userId = req.user._id.toString();

	for(var i = 0; i < req.comment.votes.length; i++) {
		if(req.comment.votes[i].userId.toString() == userId) {
			hasVoted = true;
			req.comment.votes[i].vote = 1;
		}
	}

	if (!hasVoted) {

		// Create new vote
		var vote = new Vote();

		vote.userId = req.user._id;
		vote.vote = 1;

		// Add vote
		req.comment.votes.push(vote);
	}

	// Enable update middleware to access the new comment
	req.body = req.comment;

	// Pass to next middleware
	return next();
};

exports.deleteVote = function (req, res, next) {
	var userId = req.user._id.toString();

	for (var i = 0; i < req.comment.votes.length; i++) {
		if (req.comment.votes[i].userId.toString() == userId) {
			req.comment.votes[i].vote = 0;
			req.body = req.comment;
			return next();
		}
	}

	console.log('Delete upvote: user vote not found');
	return next();
}

//=========
// DOWNVOTE
//=========
exports.downvote = function (req, res, next){
	
	// Check if user has already voted
	var hasVoted = false;
	var userId = req.user._id.toString();

	for(var i = 0; i < req.comment.votes.length; i++) {
		if(req.comment.votes[i].userId.toString() == req.user._id) {
			hasVoted = true;
			req.comment.votes[i].vote = -1;
		}
	}

	if (!hasVoted) {

		// Create new vote
		var vote = new Vote();

		vote.userId = req.user._id;
		vote.vote = -1;

		// Add vote
		req.comment.votes.push(vote);
	}

	// Enable update middleware to access the new comment
	req.body = req.comment;

	// Pass to next middleware
	return next();
};