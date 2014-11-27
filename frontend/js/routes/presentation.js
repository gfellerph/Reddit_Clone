module.exports = [
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider.
		
			when('/presentation', { templateUrl: '/presentation', controller: 'AuthController'}).

			otherwise( { redirectTo: '/404' })
	}
];