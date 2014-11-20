module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	function ($scope, $http, $routeParams) {
		
		//=======
		// CREATE
		//=======

		$scope.create = function (post) {
			console.log('create post', post);
			var $post = new Post(post);
			$http.post('/api/post', $post)
				.success ( function (data) {
					$scope.posts.push(data);
				})
				.error ( function (err) {
					console.log(err);
				});
		}
	}
];