var mongoose	= require('mongoose');
var PostSchema = mongoose.Schema.PostSchema;
var VoteSchema	= mongoose.Schema.VoteSchema;

var commentSchema = mongoose.Schema({
	text: String,
	votes: [VoteSchema],
	post: {type: String, ref: 'Post'},
	user: {type: String, ref: 'User'},
	posted: Date
});

module.exports = mongoose.model('Comment', commentSchema);