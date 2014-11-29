module.exports = function(io) {
	function init() {
		io.on('connection', function (socket) {
			console.log('socket initialized');
		});
	}

	return {
		init: init
	}
};