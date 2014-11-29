var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $routeParams, SocketIO) {

		var isItMyPost;

		isItMyPost = function (id) {
			return $scope.post._id == id;
		}

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
				$scope.comments = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// New comment incoming, check if it belongs to this post
		SocketIO.on('comment.new', function (data) {
			if (!isItMyPost(data.post)) return;
			$scope.comments.push(data);
			$scope.$apply();
		});

		SocketIO.on('comment.vote', function (data) {
			if (!isItMyPost(data.post)) return;
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i]._id == data._id) {
					$scope.comments[i] = data;
					$scope.$apply();
					return;
				}
			}
		});

		SocketIO.on('comment.delete', function (data) {
			console.log('Deleted comment: ', data);
			if (!isItMyPost(data.post)) return;
			console.log('this is my post');
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i]._id == data._id) {
					console.log('found comment to remove');
					$scope.comments.splice(i, 1);
					$scope.$apply();
					return;
				}
			}
		});
	}
];