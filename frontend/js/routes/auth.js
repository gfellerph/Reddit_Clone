module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// List of all posts
			when('/auth', {
				templateUrl: '/auth/login'
				//,controller: 'AuthController'
			}).

			// Detail of specific post
			when('/auth/register', {
				templateUrl: '/auth/register'
				//,controller: 'AuthController'
			}).
			
			otherwise( { redirectTo: '/404' })
	}
];