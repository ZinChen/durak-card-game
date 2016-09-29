var express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    app = express(),
    durak = require('./durak.js');

app.use(express.static(path.join(__dirname,'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname,'public'));

var server = require('http').createServer(app).listen(process.env.PORT || 8080),
    io = require('socket.io').listen(server);

app.get('/game/:room', function(req, res) {
    var room = req.params.room;
    res.render('room', {room: room});
});

durak.initGame(io);
io.on('connection', function(socket) {
    durak.initConnection(socket);
});
