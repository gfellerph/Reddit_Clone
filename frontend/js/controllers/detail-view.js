var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $routeParams, SocketIO) {

		// Form model/Detail view
		$scope.post = {};
		$scope.comments = [];

		// Get details of one post
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// Get comments for that post
		$http.get('/api/comments/to/' + $routeParams.id)
			.success ( function (data) {
				console.log(data);
				$scope.comments = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// New comment incoming, check if it belongs to this post
		SocketIO.on('comment.new', function (data) {
			if (data.post != $scope.post._id){
				return;
			}
			$scope.comments.push(data);
			$scope.$apply();
		});
	}
];