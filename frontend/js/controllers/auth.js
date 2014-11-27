var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'$location',
	function ($scope, $http, $routeParams, $location) {
		$scope.user = false;

		// Expose user to root scope
		$scope.$watch('user', function (user) {
			$scope.$root.user = user;
		});

		// Get user info
		var req = $http.get('/api/user')
			.success ( function (data) {
				$scope.user = data;
			})
			.error ( function (err) {
				console.log(err);
			});

		// Underline active page
		$scope.isActive = function (route) {
			return route === $location.path();
		}

		$scope.logout = function () {
			$scope.user = false;
			$location.path('/logout');
		}
	}
];