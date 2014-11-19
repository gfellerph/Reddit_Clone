var User = require('../models/user');

module.exports = [
	'$scope',
	'$http',
	'$routeParams',
	'$location',
	function ($scope, $http, $routeParams, $location) {

		$scope.isActive = function (route) {
			return route === $location.path();
		}

	}
];