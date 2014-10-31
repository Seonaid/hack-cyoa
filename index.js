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
client.hset('story', "1", "You creep through the front door and feel a chill run down your spine. Do you go up the cobwebbed stairs or follow the ghost into the library?");
client.hset('images', "1", "/assets/css/spookyStairs.jpg");
client.hset('button', "10", "Go up stairs");
client.hset('button', "11", "Go into library");

client.hset('story', "10", "Walking up the stairs, you can feel each stair give beneath your feet. The railing is covered in cobwebs, and wobbles when you touch it. Do you use the railing?");
client.hset('images', "10", "/assets/css/spookyStairsup.jpg");
client.hset('button', "100", "No railing");
client.hset('button', "101", "Railing");

client.hset('story', "100", "You wobble as you go up the stairs, but you keep your hands away from the railing. Your foot cracks the top stair, but you leap at the last moment onto the landing. Your heart is racing, and just as you start to catch your breath, the door at the end of the hall starts to shimmer and move. Do you go towards the door, or run back down the stairs?");
client.hset('images', "100", "/assets/css/spookyStairsup.jpg");
client.hset('button', "1000", "go towards the light")
client.hset('button', "1001", "run down the stairs");

client.hset('story', "1000", "As you walk down the hallway, the glow behind the door becomes more and more intense. The door is visibly writhing and the handle avoids you when you reach for it. Do you try to catch it?");
client.hset('button', "10000", "give up");
client.hset('button', "10001", "grab the knob");

client.hset('story', "1001", "You turn and race back down the stairs, barely touching each step beneath you. You can feel the entire staircase shaking under your weight, and what little bit of your mind is left fears what might happen if the staircase collapses... but the terror of whatever is up there has overcome your desire to explore. You burst through the front door and collapse on the lawn as the building starts to shake. Light radiates from every window and you hear a scream of rage... but you have lived to tell about it.");

client.hset('story', "101", "You place your hand on the railing and feel something scuttle under your fingertips. As you scream, you hear an echoing wail from the very top of the house... something is up there.");



client.hset('story', "11", "The little girl informs you that IT is watching you and unless you find IT soon, IT will take over your mind and control you and you will end up like dad(the skeleton). Do you Search or Run?");
client.hset('images', "11", "/assets/css/library.jpg");
client.hset('button', "110", "Run");
client.hset('button', "111", "Search");

client.hset('story', "110", "bookshelf: As you walk forward, a book floats off the shelf and opens itself in front of you. The page shakes and words appear in red,. As they scrawl across the page, you hear a voice rasp, 'Heeellpppp... mmmmeeeee.' Do you come closer to the book? ");
client.hset('button', "1100", "No, I get out of here!");
client.hset('button', "1101", "Yes, I want to know what's going on.");

client.hset('story', "111", "The desk chair pushes back and you feel compelled to sit in it. As you do, it pulls itself back in and a pen rises from the top of the desk. The pen writes the words, 'I am lost' on the pad of paper in front of you. As you watch it fall, the drawer beside you opens, and papers begin to stream out. They fly around your head and with the last one, a key falls upon the desk. It appears to be pulsating. Do you pick it up?");
client.hset('button', "1110", "No, I look at the papers.");
client.hset('button', "1111", "Yes, pick up the key.");


client.hset('story', "1100", "You frown at the book and back slowly away. As it comes towards you, you start moving faster and faster. You turn at the door just as the book starts hitting you on the head and shoulders. You hear a voice scream, 'Listen!' but the terror has overwhelmed your curiousity. ");
client.hset('story', "1101", "Book: Yes, I want to know what's going on.");

client.hset('story', "1110", "investigate");
client.hset('story', "1111", "ignore");


io.on('connection', function(socket){
	console.log('User connected');

	socket.on('join', function(){
//		socket.userName = name;
//		text = "Welcome to the haunted house, " + socket.userName + ".";
//		socket.emit('message', text);
		client.hget('story', 1, function(err, reply){
			socket.emit('message', reply);
		});
	});

	socket.on('choice', function(data){
/* pass data from browser, which indexes the hash of text story components. 
In this section we retrieve.
*/
//		console.log('button says ' + data);
		client.hget('images', data, function(err, reply){
			if(typeof(reply) != "null") {
			socket.emit('picture', reply);
		}
		});
		client.hget('story', data, function(err, reply){
			socket.emit('message', reply); // send text from current choice to the browser
		});

// retrieve text from next two buttons		
		var dkey = data.toString();
		dkey0 = dkey + "0";
//		console.log(dkey0);
		client.hget('button', dkey0, function(err, reply){
			console.log(dkey0);
			socket.emit('button', dkey0 + ":" + reply);
		});

		dkey1 = dkey + "1";
//		console.log(dkey1);
		client.hget('button', dkey1, function(err, reply){
			console.log(dkey1);
			socket.emit('button', dkey1 + ":" + reply);
		});


//		socket.emit('tree', data);
	});
	
	socket.on('disconnect', function(){
		console.log('User disconnected');
	});


});

http.listen(8080, function(){
	console.log('listening on *:8080');
});
