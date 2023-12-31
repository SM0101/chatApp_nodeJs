var express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
 res.sendfile(__dirname + '/public/index.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {
 socket.on('sendchat', function (data) {
 io.sockets.emit('updatechat', socket.username, data);
 });

 socket.on('adduser', function(username){
 socket.username = username;
 usernames[username] = username;
 socket.emit('updatechat', 'SERVER', 'Welcome!');
 socket.broadcast.emit('updatechat', 'SERVER'
 , username + ' has connected');
 io.sockets.emit('updateusers', usernames);
 });

 
  // Listen for file messages
  socket.on('filemessage', function(file){
    // Broadcast the file to all other sockets
  io.sockets.emit('updatechat', socket.username, file);
  });

 socket.on('disconnect', function(){
 delete usernames[socket.username];
 io.sockets.emit('updateusers', usernames);
 socket.broadcast.emit('updatechat', 'SERVER'
 , socket.username + ' has disconnected');
 });
});
var port = 1234;
server.listen(port);
console.log('Listening on port: ' + port);
