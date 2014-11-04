var Post = require('../../../models/post');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.post = new Post();

		// Get list of posts
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = new Post(data);
			})
			.error ( function (err) {
				console.log(err);
			});
	}
];