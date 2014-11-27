var Post = require('../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		// Form model/Detail view
		$scope.post = {};

		// Get details of one post
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		//console.log($scope);
	}
];