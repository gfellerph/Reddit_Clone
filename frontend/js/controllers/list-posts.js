var Post = require('../models/post');
var Score = require('../models/score');


module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'SocketIO',
	'$rootScope',
	function ($scope, $http, $location, $routeParams, SocketIO, $rootScope) {

		// List of all posts
		$scope.posts = [];


		//=====
		// LIST
		//=====

		// Get list of posts
		$http.get('/api/posts')
			.success ( function (data) {
				$scope.posts = data;
			})
			.error ( function (err) {
				console.log(err);
			});


		//==========================
		// Register Socket io events
		//==========================

		// New post is submitted, add it to list
		SocketIO.on('post.new', function (data) {
			$scope.posts.push(data);
			$scope.$apply();
		});

		// New vote submitted
		SocketIO.on('post.vote', function (data) {
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
			for (var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i]._id == data._id) {
					$scope.posts.splice(i, 1);
					$scope.$apply();
					$scope.packery.layout();
					return;
				}
			}
		});

		// New comment
		SocketIO.on('comment.new', function (data) {
			for (var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i]._id == data.post) {
					$scope.posts[i].comments.push(data._id);
					$scope.$apply();
					return;
				}
			}
		});

		// Deleted comment
		SocketIO.on('comment.delete', function (data) {
			for (var i = 0; i < $scope.posts.length; i++) {
				if ($scope.posts[i]._id == data.post) {
					for (var ii = 0; ii < $scope.posts[i].comments.length; ii++){
						if ($scope.posts[i].comments[ii] == data._id){
							$scope.posts[i].comments.splice(ii, 1);
							$scope.$apply();
							return;
						}
					}
				}
			}
		});
	}
];