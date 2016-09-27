var io;
var gameSocket;

exports.initGame = function(sio, socket) {
    io = sio;
    gameSocket = socket;
    socket.emit('connected', {message: "You are connected!"});
    socket.on('message', function(data) {
        try {
            socket.emit('message', data);
            socket.broadcast.to(socket.room).emit('message', data);
        } catch (e) {
            console.log(e);
            socket.disconnect();
        }
    });

    socket.on('switchRoom', function(data) {
        if (data.room) {
            socket.join(data.room);
            socket.room = data.room;
            console.log('room switched to: ' + data.room);
        }
    });
};
