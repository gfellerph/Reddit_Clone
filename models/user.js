var extend = require('extend');

// User model
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		name: '',
		joined: Date.now()
	}

	return extend($scope, DEFAULT, constructor);
};