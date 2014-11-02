module.exports = ['$scope', '$http', function ($scope, $http) {

	// Get list of posts
	$http.get('/api/posts')
		.success ( function (data) {
			$scope.posts = data;
		})
		.error ( function (err) {
			console.log(err);
		});
}];