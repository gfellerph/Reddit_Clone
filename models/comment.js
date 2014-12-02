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
});

commentSchema.pre('remove', function (next) {
	console.log('post remove', this.post, this._id);
	/*this.model('Post').update({
			_id: this.post
		},
		{
			$pull: {comments: this._id}
		},
		{
			multi: true
		},
		next
	);*/
});

module.exports = mongoose.model('Comment', commentSchema);
