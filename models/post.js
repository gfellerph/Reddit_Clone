var User 	= require('./user');
var Score 	= require('./score');

// Data model of a post
module.exports = function (object){

	var $this = this;

	if(!object) object = {score: {}, user: {}};

	this.title 	= object.title 	|| '';
	this.text 	= object.text 	|| '';
	this.image 	= object.image 	|| '';
	this.posted = object.posted || Date.now();
	this.score 	= object.score;
	this.user 	= object.user;
};