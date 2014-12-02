module.exports = ['$rootScope', function ($rootScope) {
	var socket = $rootScope.socketIO;
	if (socket === undefined || socket === null) {
		socket = io.connect();
		$rootScope.socketIO = socket;
	}
	return socket;
}];