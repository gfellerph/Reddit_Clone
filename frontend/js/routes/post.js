module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: '/posts/list',
				controller: 'PostListController'
			}).
			when('/post/:id', {
				templateUrl: function ($params) {
					return '/posts/post/' + $params.id
				},
				controller: 'PostReadController'
			}).
			when('/404', {
				templateUrl: '/posts/404'
			}).
			otherwise( { redirectTo: '/404' })
	}
];