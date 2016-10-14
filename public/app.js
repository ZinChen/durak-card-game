var IO, app;

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
            IO.socket.on('countdownStarted', IO.onCountdownStarted);
            IO.socket.on('countdownCanceled', IO.onCountdownCanceled);
            IO.socket.on('setCards', IO.onSetCards);
            IO.socket.on('gameStarted', IO.onGameStarted);

            document.getElementsByClassName('send-message')[0].addEventListener('click', function(e) {
                IO.sendMessage();
            });
            document.getElementById('btn-name').addEventListener('click', function(e) {
                IO.setName();
            });
            document.getElementById('test').addEventListener('click', function(e) {
                IO.socket.emit('test', {});
            });
            $('input[name="ready"').on('click', function(e) {
                console.log(this.checked);
                IO.socket.emit('ready', this.checked);
            });

            $('#end-game').on('click', function(e) {
                IO.socket.emit('endGameTest');
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

        onCountdownStarted: function(data) {
            console.log('onCountdownStarted');
        },

        onCountdownCanceled: function(data) {
            console.log('onCountdownCanceled');
        },

        onGameStarted: function(data) {
            console.log('game started!');
            console.log(data);
        },

        onSetCards: function(data) {
            console.log(data);
            app.setCards(data.cards);
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
        },

        attack: function(card) {
            IO.socket.emit('attack', {card: card});
        }
//============================ END EMIT ==============================\\
    };

    app = {
        cards: [],

        init: function() {
            $(document).on('click', '.card', function(e) {
                var cardId = $(this).data('id');
                var card = app.cards[cardId];
                console.log('attack with card');
                console.log(card);
                IO.attack(card);
                $(this).remove();
            });
        },

        setCards: function(cards) {
            app.cards = cards;
            var $cp = $('.control-panel');
            cards.forEach(function(card, i) {
                var id = 'data-id="' + i + '"';
                $('<div class="card" ' + id + '">')
                    .html(card.name + ' ' + card.suit)
                    .appendTo($cp);
            });
            // draw here div with
        }
    };

    IO.init();
    app.init();
});
