// server side scripting for choose your own adventure app

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var numUsers = 0;

var redis = require ("redis");
var client = redis.createClient();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use("/assets", express.static(__dirname + '/assets'));

io.on('connection', function(socket){
	client.setnx('userId', 1000);
	console.log('User connected');
	});
	
	socket.on('disconnect', function(){
		console.log('User disconnected');
	});


});

http.listen(8080, function(){
	console.log('listening on *:8080');
});
