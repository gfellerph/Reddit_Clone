module.exports = function () {
	var socket = io.connect();
	return socket;
};