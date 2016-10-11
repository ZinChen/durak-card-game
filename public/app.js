var IO;

document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    // var IO = {
    IO = {
        init: function() {
            IO.socket = io.connect();
            IO.bindEvents();
            IO.socket.data = {};
        },

        bindEvents: function() {
            IO.socket.on('connected', IO.onConnected);
            IO.socket.on('message', IO.onMessage);
            IO.socket.on('setName', IO.onSetName);
            IO.socket.on('refreshNames', IO.onRefreshNames);

            document.getElementsByClassName('send-message')[0].addEventListener('click', function(e) {
                IO.sendMessage();
            });
            document.getElementById('btn-name').addEventListener('click', function(e) {
                IO.setName();
            });
            document.getElementById('test').addEventListener('click', function(e) {
                IO.socket.emit('test', {});
            });
        },

//============================ ON ==============================\\
        onConnected: function(data) {
            IO.socket.emit('switchRoom', {room: room});
            console.log(room);
            console.log(data.message);
        },

        onMessage: function(data) {
            console.log(data.name);
            console.log(data.message);
        },

        onSetName: function(data) {
            console.log(data);
            IO.socket.data.myName = data;
            $('#name-input').html(data);
            $('#layout-name').css('display', 'none');
        },

        onRefreshNames: function(data) {
            var $userList = $('.users'),
                dataLi = '';

            data.forEach(function(val) {
                dataLi += '<li>'+val+'</li>';
            });

            $userList.html(dataLi);
        },
//============================ END ON ==============================\\


//============================ EMIT ==============================\\
        sendMessage: function() {
            var name = IO.socket.data.myName || 'Guest';
            var message = document.getElementsByClassName('message-text')[0].value || 'message';
            IO.socket.emit('message', {message: message, name: name});
        },

        setName: function() {
            var name = document.getElementById('name').value || 'Guest';
            IO.socket.emit('setName', name);
        }
//============================ END EMIT ==============================\\
    };

    IO.init();
});
