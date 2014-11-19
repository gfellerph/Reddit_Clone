module.exports.authHeader = ['$location', function ($location) {
	return {
		restrict: 'E'
		,templateUrl: '/auth/header'
		,link: function ($scope, $element, $attrs) {
			console.log('$attrs.href: ', $attrs.href)
			var path = $attrs.href.substring(1);
			$scope.$location = $location;
			$scope.$watch('$location.path()', function (locPath) {
				(path === locPath) ? $element.addClass("current") : $element.removeClass("current");
			});
		}
	};
}];