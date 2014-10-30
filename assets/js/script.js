// client side scripting for chat app

   // remember: localName is global in scope. In future iterations, it should be passed by a login script.
var server = io();
server.on('connect', function(data){
	localName = prompt("What is your name?");
	server.emit('join', localName);
});


var socket = io();
$('form').submit(function(){

	
});

socket.on('message', function(msg){
	$('#story').append($('<li>').text(msg));
});

socket.on('chatters', function(chatters){

});

