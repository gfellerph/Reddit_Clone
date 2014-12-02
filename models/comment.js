var mongoose	= require('mongoose');
var PostSchema = mongoose.Schema.PostSchema;
var VoteSchema	= mongoose.Schema.VoteSchema;
var Post = require('./post');

var commentSchema = mongoose.Schema({
	text: String,
	votes: [VoteSchema],
	post: {type: mongoose.Schema.ObjectId, ref: 'Post'},
	user: {type: String, ref: 'User'},
	posted: Date
}, {
	toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

commentSchema.virtual('score').get(function() {
	var score = 0;
	if(!this.votes) return score;
	for (var i = 0; i < this.votes.length; i++) {
		score += this.votes[i].vote;
	}	
	return score;
});

module.exports = mongoose.model('Comment', commentSchema);
