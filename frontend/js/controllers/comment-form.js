// Requires
var Comment = require('../models/comment');
var User = require('../models/user');

// CommentFormController
module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $routeParams, SocketIO) {

		// ID of the post
		$scope.postId = $routeParams.id;
		$scope.comment;

		//=======
		// CREATE
		//=======

		$scope.create = function (comment) {
			$http.post('/api/comment/to/' + $scope.postId, $scope.comment)
			.success ( function (data) {
			})
			.error ( function (err) {
				console.log(err);
			});
			$scope.comment = "";
		}
	}
];