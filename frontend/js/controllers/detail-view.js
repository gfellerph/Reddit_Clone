var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $routeParams, SocketIO) {

		var isItMyPost;

		isItMyPost = function (id) {
			if (!$scope.post) return false;
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
			$scope.post.comments.push(data._id);
			$scope.$apply();
		});

		SocketIO.on('comment.vote', function (data) {
			if (!isItMyPost(data.post)) return;
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i] == data._id) {
					$scope.comments[i] = data;
					$scope.$apply();
					return;
				}
			}
		});

		// New vote submitted
		SocketIO.on('post.vote', function (data) {
			$scope.post.votes = data.votes;
			$scope.$apply();
		});

		// Comment deleted, update post and comment
		SocketIO.on('comment.delete', function (data) {
			if (!isItMyPost(data.post)) return;
			for(var i = 0; i < $scope.post.comments.length; i++) {
				if ($scope.post.comments[i] == data._id) {
					$scope.post.comments.splice(i, 1);
				}
			}
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i]._id == data._id) {
					$scope.comments.splice(i, 1);
					$scope.$apply();
					return;
				}
			}
		});

		// Post deleted
		SocketIO.on('post.delete', function (data) {
			$scope.post.text = '';
			$scope.post.url = '';
			$scope.post.user.local.username = '';
			$scope.post.title = 'Post has been deleted';
			$('.post .meta').remove();
			$('.post .author').remove();
			$scope.$apply();
		});
	}
];