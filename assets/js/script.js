// client side scripting for chat app

   // remember: localName is global in scope. In future iterations, it should be passed by a login script.
var server = io();
/*server.on('connect', function(data){
	localName = prompt("What is your name?");
	server.emit('join', localName);
});
*/


var socket = io();
$('form').submit(function(){

});

socket.on('message', function(msg){
    var x = msg;
	$('#story').html(msg);
});

function sendChoice(clicked_id){
	server.emit('choice', clicked_id);
    $('.yes').remove();
    $('.no').remove();
}

function add(type, data) {
    //Create an input type dynamically.   
    var element = document.createElement("input");
    //Assign different attributes to the element. 
    info = data.split(":"); 
    if (info[0]%2 === 0) {
        element.className = "yes";
    }
    else{
        element.className = "no";
    }

    element.type = type;
    element.value = info[1];
    element.id = info[0];  // And the name too?\
    element.onclick = function() { // Note this is a function
        sendChoice(this.id);
    };
/*
    var foo = document.getElementById("story");
    //Append the element in page (in span).  
    foo.appendChild(element);
*/
    $("#buttons").append(element);

  
}

socket.on('button', function(text){
	add('button', text);
	buttonBits = text.split(":");
	buttonId = text[0];
});

socket.on('picture', function(url){
	document.getElementById("backpic").src = url;
 //   $(".yes", ".no").remove();

});
