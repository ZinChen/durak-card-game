// Deck - Колода
// Trump - Козырь
// Hearts - Черви
// Diamonds - Бубны
// Spades - Пики
// Clubs - Крести
// Ace - Туз
// King - Король
// Queen - Дама
// Jack - Валет
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
        var roomName = socket.room,
            room = io.sockets.adapter.rooms[roomName],
            users = getUsersInRoom(socket.room),
            players = _.filter(users, 'isPlayer'),
            readyPlayers = _.filter(users, {'ready': true});

        if (players.length == readyPlayers.length) {
            console.log('game will be started!');
        }
        else {
            return;
        }

        var deck = generateCardDeck(),
            playerIds = _.map(players, 'id'),
            randomIndex = Math.floor(Math.random()*playerIds.length),
            startPlayerId = playerIds[randomIndex],
            prevPlayerIndex = randomIndex ? randomIndex - 1 : playerIds.length - 1,
            prevPlayerId = playerIds[prevPlayerIndex];
        room.game = [];
        room.game.deck = deck;
        room.game.trump = deck[0].suit;
        room.game.currentPlayer = startPlayerId;
        room.game.prevPlayer = prevPlayerId;
        players.forEach(function(p, i, players) {
            players[i].cards = [];
        });
        for (var i = 0; i < 6; i++) {
            players.forEach(function(p, i, players) {
                var card = room.game.deck.pop();
                players[i].cards.push(card);
            });
        }
        players.forEach(function(p, i, players) {
            var player = players[i];
            player.emit('setGameData', {
                'trump': room.game.trump,
                'firstPlayer': startPlayerId,
                'prevPlayer': prevPlayerId,
                'cards': player.cards
            });
        });
        // io.to(roomName).emit('startGame');
    });

    socket.on('step', function(data) {
        // check is player socket id == room.game.currentPlayer

        // check is socket has this card, and pop them
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
        var users = getUsersInRoom(socket.room);
        var players = _.map(users, 'data.username');

        socket.emit('refreshNames', players);
        socket.broadcast.to(socket.room).emit('refreshNames', players);
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

    var generateCardDeck = function() {
        var names = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        var suits = ['Hearts','Diamonds','Spades','Clubs'];
        var cards = [];

        suits.forEach(function(suit) {
            names.forEach(function(name) {
                cards.push({
                    name: name,
                    suit: suit
                });
            });
        });

        console.log(cards);

        var currentIndex = cards.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temporaryValue;
        }
        return cards;
    };
};
