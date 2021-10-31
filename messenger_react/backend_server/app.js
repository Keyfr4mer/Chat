var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));
//app.get('/', function(req, res,next) {
//    res.sendFile(__dirname + '/index.html');
//});

let client_count = 0;
io.on('connect', function(socket) {
    //const username = environ;
    socket.data.username = 'username';
    console.log(socket.id);
    //if (!username){
    //    return false;
    //}
    //io.emit('user_joined', username);
    client_count += 1;
    console.log(client_count + " Clients connected");
    io.emit('user_joined', 'username');
    io.emit('client_count', client_count);


    socket.on('disconnect', function(reason) {
        client_count -= 1;
        console.log(client_count + " Clients connected");
        io.emit('user_left', 'username');
        io.emit('client_count', client_count);
    });

    socket.on('message', function(data) {
        console.log('message: ' + data)
        socket.broadcast.emit('message', data)
    });
});

server.listen(8000);
