var Score 	= require('./score');
var extend = require('extend');

// Data model of a post
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		title: '',
		text: '',
		image: '',
		posted: Date.now(),
		score: new Score()
	}

	return extend($scope, DEFAULT, constructor);
};