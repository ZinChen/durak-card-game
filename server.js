var express = require('express'),
    path = require('path'),
    app = express(),
    durak = require('./durak.js');

app.use(express.static(path.join(__dirname,'public')));

var server = require('http').createServer(app).listen(process.env.PORT || 8080),
    io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    durak.initGame(io, socket);
});
