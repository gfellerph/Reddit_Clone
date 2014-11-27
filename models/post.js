var mongoose	= require('mongoose');
var VoteSchema	= mongoose.Schema.VoteSchema;
var CommentSchema = mongoose.Schema.CommentSchema;

var postSchema = mongoose.Schema({
	title: String,
	text: String,
	url: String,
	posted: Date,
	type: String,
	votes: [VoteSchema],
	user: {type: String, ref: 'User'}
});

module.exports = postSchema;