module.exports.list = function () {
	return {
		templateUrl: '/posts/post-template',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};

module.exports.detail = function () {
	return {
		templateUrl: '/posts/post-detail',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form',
		link: function (scope, element, attrs) {
			console.log(element);
		}
	};
};