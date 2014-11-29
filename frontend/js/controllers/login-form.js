var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$location',
	function ($scope, $http, $location) {
		


		//=======
		// CREATE
		//=======

		$scope.login = function (user) {
			
			$http.post('/auth/login', user)
				.success ( function (data) {
					//$location.path('/');
				})
				.error ( function (err) {
					console.log(err);
				});
		}
	}
];