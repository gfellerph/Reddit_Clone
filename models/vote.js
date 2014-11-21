var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var voteSchema = mongoose.Schema({
	userId: ObjectId,
	vote: Number
});

module.exports = mongoose.model('Vote', voteSchema);