var io;
var gameSocket;

exports.initGame = function(sio, socket) {
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', {message: "You are connected!"});
    gameSocket.on('message', function(data) {
        try {
            socket.emit('message', data);
            socket.broadcast.emit('message', data);
        } catch (e) {
            console.log(e);
            socket.disconnect();
        }
    });

    gameSocket.on('switchRoom', function(data) {
        if (data.room) {
            gameSocket.join(data.room);
            console.log('room switched to: ' + data.room);
        }
    });
};
