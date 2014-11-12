var extend = require('extend');

// User model
module.exports = function (constructor){

	var $scope = this;

	var DEFAULT = {
		password: '',
		username: '',
		email: '',
		joined: Date.now()
	}

	return extend($scope, DEFAULT, constructor);
};