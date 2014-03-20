// Construct the canvas
var canvas = document.getElementById("gamecanvas"),
	ctx = canvas.getContext("2d");

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

// background image
// this is to preload images. which is apparently a pain in the ass
// really don't understand it yet
// seems necessary to load before rendering which for some reason requires preloading... tf


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

var bricksCaught= 0; // amount of bricks caught so far


// more cool stuff - CHAOS CONTROL... err KEYBOARD control

var keysDown = {};

// keydown is string representing event type to listen for
// https://developer.mozilla.org/en-US/docs/Web/Reference/Events
// keydown is for "a key is pressed down"... good enough for me
// then the keycode for the key pressed is added to the keysDown array with value true
// the final parameter, set false, differentiates real key presses from artificial in firefox
// it does nothing in chrome gdi


addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// okay now this part is supposed to reset the game when you catch the bricks
// i hate defining functions as objects

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
	if (40 in keysDown) { //38 is the up key
		player.y += player.speed * modifier, ctx.clearRect(0,0,512,480);
	}
	if (37 in keysDown) { //38 is the up key
		player.x -= player.speed * modifier, ctx.clearRect(0,0,512,480);
	}
	if (39 in keysDown) { //38 is the up key
		player.x += player.speed * modifier, ctx.clearRect(0,0,512,480);
	}

// now we check collision of the player and the brick
// positions are in the top left corner of images, so this method
// checks if 

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


// good good. now to render things

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