module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			// Profile of a user
			when('/profile/:id', {
				templateUrl: 'profile/template',
				controller: 'ProfileController'
			})
	}
];