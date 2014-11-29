module.exports = function () {
	var socket = io.connect();
	console.log(socket);
	return socket;
};