var io,
    _ = require('lodash'),
    id = 0,
    maxPlayerNum = 4;

exports.initGame = function(sio) {
    io = sio;
};

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

        users = getUsersInRoom(socket.room);

        var players = _.filter(users, 'isPlayer');
        if (players.length < maxPlayerNum) {
            socket.isPlayer = true;
        } else {
            socket.isPlayer = false;
        }
    });

    socket.on('ready', function(ready) {
        if (!socket.isPlayer) {
            return;
        }
        socket.ready = ready;
        // console.log(ready);
        // console.log(socket.isPlayer);
        var roomName = socket.room,
            room = io.sockets.adapter.rooms[roomName],
            users = getUsersInRoom(socket.room);
        // if all players has status ready = true

        // console.log(users);
        var players = _.filter(users, 'isPlayer');
        var readyPlayers = _.filter(users, {'ready': true});
        if (players.length == readyPlayers.length) {
            console.log('game will be started!');
        }
        // choose first player
        // choose trump

        // deck - колода
        // trump - козырь
        var deck = [];// generate here 36 cards in random order to put it in array
        room.game = [];
        room.game.deck = deck;
        room.game.trump = 'trump';
        room.game.currentPlayer = 'id';
        var players = []; //get players from users
        for (var i = 0; i < 6; i++) {
            for (var player in players) { //player is player socket
                // var card = room.game.deck.pop();
                // player.cards.push(card);

                // player.emit('setGameData', {
                //     'trump': 'spades',
                //     'firstPlayer': 'id',
                //     'cards': 'cards'
                // });
            }
        }
        io.to(roomName).emit('startGame');
    });

    socket.on('step', function(data) {
        // check is player socket id == room.game.currentPlayer

        // check is socket has this card, and pop them
    });
};

var getUsersInRoom = function(room) {
    var userIds = io.sockets.adapter.rooms[room].sockets;
    var users = [];
    for (var userId in userIds) {
        var user = io.sockets.connected[userId];
        users.push(user);
    }
    return users;
};
