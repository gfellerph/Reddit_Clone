exports.comment = function () {
	return {
		templateUrl: '/comments/comment-template',
		controller: 'CommentController',
		replace: true
	};
};

exports.commentForm = function () {
	return {
		templateUrl: '/comments/comment-form',
		controller: 'CommentFormController',
		replace: true
	};
};