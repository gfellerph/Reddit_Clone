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
}, {
	toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

postSchema.virtual('score').get(function() {
	var score = 0;
	for (var i = 0; i < this.votes.length; i++) {
		score += this.votes[i].vote;
	}	
	return score;
});

module.exports = mongoose.model('Post', postSchema);