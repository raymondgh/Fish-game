/////////////////////chat stuff/////////////////////////
jQuery(document).ready(function () {
	var log_chat_message = function  (message, type) 
	{
		var li = jQuery('<li />').text(message);
		
		if (type === 'system') {
			li.css({'font-weight': 'bold'});
		} else if (type === 'leave' || type === 'error') {
			li.css({'font-weight': 'bold', 'color': '#F00'});
		}
			
		jQuery('#chat_log').append(li);
	};

	var socket = io.connect('http://localhost:3000');

	socket.on('entrance', function  (data) {
		log_chat_message(data.message, 'system');
	});

	socket.on('exit', function  (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function  (data) {
		log_chat_message(data.message, 'normal');
	});

	socket.on('error', function  (data) {
		log_chat_message(data.message, 'error');
	});

	jQuery('#chat_box').keypress(function (event) {
		if (event.which == 13) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			jQuery('#chat_box').val('');
		}
	});
////////////////Sending a message to server from canvas///////////////////
// it works! send special with 'W' while canvas in focus
	jQuery('#gamecanvas').keypress(function (event) {
		if (event.which == 119) {
			socket.emit('pmove', {message: jQuery('#chat_box').val()});
		}
	});
});

// Construct the canvas
var canvas = document.getElementById("gamecanvas"),
	ctx = canvas.getContext("2d");

    canvas.setAttribute('tabindex', 1);

	canvas.width = 512;
	canvas.height = 480;

	ctx.beginPath();
	ctx.arc(100,75,50,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(300,75,50,0,2*Math.PI);
	ctx.stroke();

		ctx.beginPath();
	ctx.arc(100,75,20,0,2*Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(300,75,20,0,2*Math.PI);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(200,150,80,.15*Math.PI,.85*Math.PI);
	ctx.fillStyle="red";
	ctx.fill();

// preload images
// player
var playerReady = false
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "images/player.png";

// brick
var brickReady = false
var brickImage = new Image();
brickImage.onload = function () {
	brickReady = true;
};
brickImage.src = "images/brick.png";

// Okay now for the good part. Game objects!

var player = {
	speed: 200,  // movement in pps
	x: 0,
	y: 0
};

var bricks = {
	x: 0,
	y: 0,
};

var keysDown = {};

// key listening

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// reset on brick capture

var reset = function () {
	player.x = canvas.width / 2;
	player.y = canvas.width / 2;

// put down the bricks randomly
	bricks.x = 16 + (Math.random() * (canvas.width - 32));
	bricks.y = 16 + (Math.random() * (canvas.height - 32));
};

// now for the actually cool stuff. the game logic

var update = function (modifier) {

	if (38 in keysDown) { //38 is the up key
		player.y -= player.speed * modifier, ctx.clearRect(0,0,512,480);
	}
	if (40 in keysDown) { //40 is the down key
		player.y += player.speed * modifier, ctx.clearRect(0,0,512,480);
	}
	if (37 in keysDown) { //37 is the left key
		player.x -= player.speed * modifier, ctx.clearRect(0,0,512,480);
	}
	if (39 in keysDown) { //39 is the right key
		player.x += player.speed * modifier, ctx.clearRect(0,0,512,480);
	}

// collishion checking (images are 16x16pixels)

	if (
		player.x <= (bricks.x + 12) 
		&& bricks.x <= (player.x + 12)
		&& player.y <= (bricks.y + 12)
		&& bricks.y <= (player.y + 12)
		)
	{
		++bricksCaught;
		reset();
	}
};

// render

var render = function () {


	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if (brickReady) {
		ctx.drawImage(brickImage, bricks.x, bricks.y);
	}

// now this part is just copied from the tutorial, but will be removed/fixed


};


// now the most important part. the big bang
// this part is interesting. i wonder if this is the common way of ticking games in js / html5

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// and this starts the game i guess

reset();
var then = Date.now();
setInterval(main, 1); // execute as fast as possible