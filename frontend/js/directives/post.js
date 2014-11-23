module.exports.list = function () {
	return {
		templateUrl: '/posts/post-template',
		replace: true
	};
};

module.exports.detail = function () {
	return {
		templateUrl: '/posts/post-detail'
		
	};
};

module.exports.form = function () {
	return {
		templateUrl: '/posts/post-form'
	};
};