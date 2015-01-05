var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// var sockets = {};
// var users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('name', function(obj){
    var message;
    if(socket.userName){
      message = 'User \'' + socket.userName + '\'';
      socket.userName = obj.userName;
      message += ' changed name to \''+socket.userName+'\'.';
    }
    else{
      socket.userName = obj.userName;
      message = 'User \'' + socket.userName + '\' has joined the chat.';
    }
    io.emit('chat message', message);
  });

  socket.on('disconnect', function(){
    if(socket.userName){
    var message = 'User \'' + socket.userName + '\' has left the chat.'
      io.emit('chat message', message);
    }
  });

  socket.on('chat message', function(msg){
    if(socket.userName){
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      io.emit('chat message', (hours < 10 ? '0' + hours : hours)+ ':'+ (minutes < 10 ? '0'+ minutes : minutes) + ' ' + socket.userName + ': ' + msg);
    }
    else{
      socket.emit('message error', 'Please choose a userName by typing /<userName>, e.g. type \'/Ceren\' to be called \'Ceren\'.');
    }
  });
});

http.listen(1234, function(){
  console.log('listening on *:1234');
});
