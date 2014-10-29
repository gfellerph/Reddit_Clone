var User 	= require('./user');
var Score 	= require('./score');

//=====
// Data model of a comment
//=====
module.exports = function (object) {
	var $scope = this;

	if(!object) object = {user: new User(), score: new Score()};

	$scope.text 	= object.text 	|| '';
	$scope.parent	= object.parent || null;
	$scope.posted 	= object.posted || Date.now();
	$scope.user 	= object.user;
	$scope.score 	= object.score;
};