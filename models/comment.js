var mongoose	= require('mongoose');
var PostSchema = mongoose.Schema.PostSchema;
var VoteSchema	= mongoose.Schema.VoteSchema;

var commentSchema = mongoose.Schema({
	text: String,
	votes: [VoteSchema],
	//post: {tpye: String, ref: 'Post'},
	user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Comment', commentSchema);