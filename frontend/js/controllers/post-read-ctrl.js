module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.post = {};
		$scope.comments = [];

		// Get list of posts
		$http.get('/api/post/' + $routeParams.id)
			.success ( function (data) {
				$scope.post = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// Get the comments
		$http.get('/api/comments/to/' + $routeParams.id)
			.success ( function (data) {
				$scope.comments = data;
			})
			.error ( function (err) {
				console.log(err);
			});
	}
];