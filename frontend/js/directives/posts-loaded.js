module.exports = function () {

	var linkFunction;
	var controllerFunction;

	var $posts = $('.posts');

	linkFunction = function (scope, element, attrs) {
		if(scope.$last){
			setTimeout(function () {
				scope.$emit('postsloaded', element, attrs);
			}, 1);
		};
	};

	controllerFunction = function ($scope) {
		$scope.$on('postsloaded', function (e) {
			
			// Initialize packery
			$posts.packery({
				itemSelector: 'li',
				gutter: 10
			});
		});
	};

	return {
		link: linkFunction,
		restrict: 'A',
		controller: controllerFunction
	}
};