module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/login', {
				templateUrl: '/auth'
				,controller: 'AuthController'
			}).

			// Detail of specific post
			when('/register', {
				templateUrl: '/auth/register'
				,controller: 'AuthController'
			}).

			// Logout
			when('/logout', {
				templateUrl: '/auth/logout'
				,controller: 'AuthController'
			})
	}
];