var mongoose	= require('mongoose');
var ObjectId	= mongoose.Schema.ObjectId;
var VoteSchema	= mongoose.Schema.VoteSchema;

var postSchema = mongoose.Schema({
	title: String,
	//text: String,
	url: String,
	posted: Date,
	votes: [VoteSchema],
	user: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Post', postSchema);