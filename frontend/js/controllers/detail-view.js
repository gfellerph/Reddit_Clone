var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

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
	}
];