module.exports = ['$rootScope', function($rootScope) {

	var linkFunction;

	linkFunction = function (scope, element, attrs) {
		var imgLoad = imagesLoaded(element);

		imgLoad.on('always', function () {
			console.log('Element.packery', scope, element.packery);
		});
	};

	return {
		link: linkFunction,
		restrict: 'A'
	}
}];