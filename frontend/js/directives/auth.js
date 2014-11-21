module.exports.authHeader = ['$location', function ($location) {
	return {
		restrict: 'E'
		,templateUrl: '/auth/header'
		//,replace: true
		,controller: function ($scope) {
			console.log($scope);
		}
	};
}];