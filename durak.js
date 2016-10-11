var io,
    _ = require('lodash'),
    id = 0,
    maxPlayerNum = 4;

exports.initGame = function(sio) {
    io = sio;
}

exports.initConnection = function(socket) {
    socket.uid = id++;

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

        var userIds = io.sockets.adapter.rooms[socket.room].sockets;
        console.log('==================== ' + socket.room + ' ======================');
        console.log(io.sockets.adapter.rooms[socket.room]);
        var users = [];
        for (var userId in userIds) {
            var user = io.sockets.connected[userId];
            users.push(user);
        }

        var players = _.filter(users, 'isPlayer');
        if (players.length < maxPlayerNum) {
            socket.isPlayer = true;
        } else {
            socket.isPlayer = false;
        }
        console.log(players.length);
    });

    socket.on('ready', function(ready) {
        socket.ready = ready;
    });

    socket.on('setName', function(data) {
        if (socket.data === undefined) socket.data = {};
        socket.data.username = data;
        socket.data.id = socket.id;
        // var allUsers = socket.server.engine.clients;
        // var allUsersId = [];
        // for (v in allUsers) {
        //     allUsersId.push(v);
        // }
        socket.emit('setName', data);
        refreshNames();

    });

    var refreshNames = function() {
        var userIds = io.sockets.adapter.rooms[socket.room].sockets;
        var users = [];
        for (var userId in userIds) {
            var user = io.sockets.connected[userId];
            users.push(user);
        }

        var players = _.map(users, 'data.username');

        socket.emit('refreshNames', players);
        socket.broadcast.to(socket.room).emit('refreshNames', players);
    };

    // Player ready status
    // when player joined, set them as player
    // if max player count reached, add as spectator
};
