var Post = require('../models/post');
var Score = require('../models/score');
var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$location',
	'$routeParams',
	function ($scope, $http, $location, $routeParams) {
		
		// ID of the post
		$scope.postId = $routeParams.id;

		//=======
		// CREATE
		//=======

		$scope.create = function (post) {
			var $post = new Post(post);
			$http.post('/api/post', $post)
			.success ( function (data) {
				$location.path('/');
			})
			.error ( function (err) {
				console.log(err);
			});
		}
	}
];