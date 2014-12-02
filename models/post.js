var mongoose	= require('mongoose');

var VoteSchema	= mongoose.Schema.VoteSchema;

var postSchema = mongoose.Schema({
	title: String,
	text: String,
	url: String,
	posted: Date,
	type: String,
	votes: [VoteSchema],
	comments: [{type: mongoose.Schema.ObjectId, ref: 'Comment'}],
	user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Post', postSchema);