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
app.use('/', express.static(__dirname + '/public'));

// Populate redis with story components
client.hset('story', 1, "You are standing in the front hall. In front of you is a set of creaky stairs. To your right, a door half off its hinges hides what looks like a library. Which do you choose?");
client.hset('story', 10, "Walking up the stairs, you can feel each stair give beneath your feet. The railing is covered in cobwebs, and wobbles when you touch it. Do you use the railing?");

client.hset('story', 100, "You wobble as you go up the stairs, but you keep your hands away from the railing. Your foot cracks the top stair, but you leap at the last moment onto the landing. Your heart is racing, and just as you start to catch your breath, the door at the end of the hall starts to shimmer and move. Do you go towards the door, or run back down the stairs?");

client.hset('story', 1010, "go towards the light");
client.hset('story', 1011, "run down the stairs");

client.hset('story', 101, "You place your hand on the railing and feel something scuttle under your fingertips. As you scream, you hear an echo from the top of the house... something is up there.");



client.hset('story', 11, "You place your hand upon the handle of the door and feel a rush of cold air pass you as you push the door to the library open. You see a desk under a broken window and a bookshelf at the far end of the room next to a smoking fireplace. Do you investigate the bookshelf or the desk?");

client.hset('story', 110, "bookshelf: As you walk forward, a book floats off the shelf and opens itself in front of you. The page shakes and words appear in red,. As they scrawl across the page, you hear a voice rasp, 'Heeellpppp... mmmmeeeee.' Do you come closer to the book? ");
client.hset('story', 111, "desk");

client.hset('story', 1100, "Book: No, I get out of here!");
client.hset('story', 1101, "Book: Yes, I want to know what's going on.");

client.hset('story', 1110, "Desk: investigate");
client.hset('story', 1111, "Desk: ignore");


io.on('connection', function(socket){
	console.log('User connected');

	socket.on('join', function(name){
		socket.userName = name;
		text = "Welcome to the haunted house, " + socket.userName + ".";
		socket.emit('message', text);
		client.hget('story', 1, function(err, reply){
			socket.emit('message', reply);
		});
	});

	socket.on('choice', function(data){
/* pass data from browser, which indexes the hash of text story components. 
In this section we retrieve.
*/
		client.hget('story', data, function(err, reply){

		});
	});
	
	socket.on('disconnect', function(){
		console.log('User disconnected');
	});


});

http.listen(8080, function(){
	console.log('listening on *:8080');
});
