module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $location, $routeParams, SocketIO) {

		var isItMyUser = function (id) {
			if (!$routeParams.id) return false;
			return $routeParams.id == id;
		}

		$scope.posts = [];
		$scope.comments = [];
		$scope.userById = {};

		// Get posts from a specific user
		$http.get('/api/posts/from/user/' + $routeParams.id)
		.success( function (data) {
			$scope.posts = data;
		})
		.error( function (err) {
			console.log(err);
		});

		// Get comments from a specific user
		$http.get('/api/comments/from/user/' + $routeParams.id)
		.success( function (data) {
			$scope.comments = data;
		})
		.error( function (err) {
			console.log(err);
		});

		// Get the owner of the profile
		$http.get('/api/user/' + $routeParams.id)
		.success( function (data) {
			$scope.userById = data;
		})
		.error( function (err) {
			console.log(err);
		});

		// New comment incoming, check if it belongs to this post
		SocketIO.on('comment.new', function (data) {
			if (!isItMyUser(data.user._id)) return;
			$scope.comments.push(data);
			$scope.$apply();
		});

		// Comment voted, update list
		SocketIO.on('comment.vote', function (data) {
			if (!isItMyUser(data.user._id)) return;
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i]._id == data._id) {
					$scope.comments[i] = data;
					$scope.$apply();
					return;
				}
			}
		});

		// Comment deleted, delete it from list
		SocketIO.on('comment.delete', function (data) {
			if (!isItMyUser(data.user._id)) return;
			for(var i = 0; i < $scope.comments.length; i++) {
				if ($scope.comments[i]._id == data._id) {
					$scope.comments.splice(i, 1);
					$scope.$apply();
					return;
				}
			}
		});

		// New post is submitted, add it to list
		SocketIO.on('post.new', function (data) {
			if (!isItMyUser(data.user._id)) return;
			$scope.posts.push(data);
			$scope.$apply();
		});

		// New vote submitted
		SocketIO.on('post.vote', function (data) {
			if (!isItMyUser(data.user._id)) return;
			for(var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i]._id == data._id) {
					$scope.posts[i].votes = data.votes;
					$scope.$apply();
					return;
				}
			}
		});

		// Post deleted
		SocketIO.on('post.delete', function (data) {
			if (!isItMyUser(data.user._id)) return;
			for (var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i]._id == data._id) {
					$scope.posts.splice(i, 1);
					$scope.$apply();
					return;
				}
			}
		});
	}
];