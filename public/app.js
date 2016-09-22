document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    var IO = {
        init: function() {
            IO.socket = io.connect();
            IO.bindEvents();
        },

        bindEvents: function() {
            IO.socket.on('connected', IO.onConnected);
            IO.socket.on('message', IO.onMessage);

            document.getElementsByClassName('send-message')[0].addEventListener('click', function(e) {
                IO.sendMessage();
            });
        },

        onConnected: function(data) {
            console.log(data.message);
        },

        onMessage: function(data) {
            console.log(data.name);
            console.log(data.message);
        },

        sendMessage: function() {
            var name = document.getElementsByClassName('name-input')[0].value || 'name';
            var message = document.getElementsByClassName('message-text')[0].value || 'message';
            IO.socket.emit('message', {message: message, name: name});
        }
    };

    IO.init();
});
