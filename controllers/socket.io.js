module.exports = function(io) {

	console.log('socket.io');

    io.sockets.on('connection', function (socket) {
        socket.on('captain', function(data) {
            console.log(data);
            socket.emit('Hello');
        });
    });
};