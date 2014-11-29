var Post = require('../models/post');
var Score = require('../models/score');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	'SocketIO',
	function ($scope, $http, $location, $routeParams, SocketIO) {

		// List of all posts
		$scope.posts = [];
		
		$scope.$watch('posts', function (posts) {
			//$('.posts').packery();
		});

		// Refresh element positions
		$scope.updatePackery = function () {
			//$('.posts').packery();
		};


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

		// New post is submitted, add it to list
		SocketIO.on('post.new', function (data) {
			$scope.posts.push(data);
		});
	}
];