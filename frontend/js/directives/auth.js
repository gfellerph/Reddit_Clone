module.exports.authHeader = function () {
	return {
		templateUrl: '/auth/header',
		link: function (scope, element, attrs) {
			console.log(scope, element, attrs);
		}
	};
};