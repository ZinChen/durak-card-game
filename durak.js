var io,
    id = 0,
    maxPlayerNum = 4;

exports.initGame = function(sio) {
    io = sio;
}

exports.initConnection = function(socket) {
    socket.id = id++;

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
            socket.ready = false;
            players = io.sockets.adapter.rooms[socket.room].sockets;
            console.log(players);
            console.log(players.length);
    });

    socket.on('ready', function(ready) {
        socket.ready = ready;
    });

    // Player ready status
    // when player joined, set them as player
    // if max player count reached, add as spectator
};
