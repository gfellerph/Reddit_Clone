var mongoose	= require('mongoose');
var ObjectId	= mongoose.Schema.ObjectId;
var VoteSchema	= mongoose.Schema.VoteSchema;

var postSchema = mongoose.Schema({
	title: String,
	//text: String,
	url: String,
	posted: Date,
	votes: [VoteSchema],
	user: ObjectId
});

module.exports = mongoose.model('Post', postSchema);