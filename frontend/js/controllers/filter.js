module.exports = ['$scope', function ($scope) {

	$scope.options = [
		{key: 'all', value: 'all', selected: true},
		{key: 'image', value: 'only image'},
		{key: 'text', value: 'only text'},
		{key: 'textandimage', value: 'only text & image'}
	];
	$scope.sortOpt = [
		{key: '-posted', value: 'newness'},
		{key: 'posted', value: 'age'},
		{key: '-score', value: 'score'}
	];

	$scope.$watch('sortorder', function (post) {
		window.setTimeout(function () {
			$scope.packery.reloadItems();
			$scope.packery.layout();
		}, 100);
	});

	$scope.searchchange = function () {
		window.setTimeout(function () {
			$scope.packery.reloadItems();
			$scope.packery.layout();
		}, 100);
	}

	$scope.change = function (filter) {
		$scope.ftype = filter;
	};

	$scope.typeFilter = function (post) {
		var answer = false;
		if ($scope.ftype.key == 'all'){
			answer = true;
		} else {
			answer = (post.type == $scope.ftype.key)
		}
		window.setTimeout(function () {
			$scope.packery.reloadItems();
			$scope.packery.layout();
		}, 100);
		return answer;
	};
}];