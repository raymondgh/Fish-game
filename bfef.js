var io = require('socket.io'),
  connect = require('connect');
 // chatter = require('chatter');

var app = connect().use(connect.static('public')).listen(3000);
var fish_game = io.listen(app);


fish_game.sockets.on('connection', function (socket) {
  connect_chatter({
    socket: socket,
    username: socket.id
  });
});

//////////chatter stuff///////////
var all_sockets = null;

var set_sockets = function  (sockets) {
  all_sockets = sockets;
};

var connect_chatter = function  (config) {

  config.socket.emit('entrance', {message: 'Welcome to the chat room!'});
  all_sockets.emit('entrance', {message: config.username + ' is online.'});

  config.socket.on('disconnect', function  () {
    all_sockets.emit('exit', {message: config.username + ' has disconnected.'});
  });

  config.socket.on('chat', function  (data) {
    all_sockets.emit('chat', {message: config.username + ' says: ' + data.message});
  });

//////////sending all clients data//////////////////
////////it works! 'w' from canvas sends "hello from canvas" to all
  config.socket.on('pmove', function (data) {
  	all_sockets.emit('chat', {message: "hello from canvas"});
  });


};

var failure = function  (socket) {
  socket.emit('error', {message: 'Please log in to the chatroom.'});
};

set_sockets(fish_game.sockets);

