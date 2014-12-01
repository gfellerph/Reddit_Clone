module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/', {
				templateUrl: '/posts/list',
				controller: 'ListViewController'
			}).

			// Detail of specific post
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'DetailViewController'
			}).

			// Create post
			when('/add-link', {
				templateUrl: '/posts/post-form',
				controller: 'PostFormController'
			})

			.otherwise({
				redirectTo: '/'
			});
	}
];