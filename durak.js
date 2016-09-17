var io;
var gameSocket;

exports.initGame = function(sio, socket) {
	io = sio;
	gameSocket = socket;
	gameSocket.emit('connected', {message: "You are connected!"});
}