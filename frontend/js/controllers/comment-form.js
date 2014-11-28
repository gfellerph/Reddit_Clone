// Requires
var Comment = require('../models/comment');
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		// ID of the post
		$scope.postId = $routeParams.id;
		$scope.comment;

		//=======
		// CREATE
		//=======

		$scope.create = function (comment) {
			$http.post('/api/comment/to/' + $scope.postId, comment)
			.success ( function (data) {
				// Add comment to comment controllers comments collection
				$scope.comments.push(data);
			})
			.error ( function (err) {
				console.log(err);
			});
		}
	}
];