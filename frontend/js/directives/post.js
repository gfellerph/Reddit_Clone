module.exports.post = function () {
	return {
		templateUrl: '/posts/post-template',
		replace: true,
		controller: 'PostController'
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form',
		controller: 'PostFormController'
	};
};