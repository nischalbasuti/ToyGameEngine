var canvas = document.getElementById('game_screen');
var context = canvas.getContext('2d');

//setting mouse controls
//mouse clicks or implemented in game as Body objects and the Body.isIntersect is used to handle clicks
var mouseClickL	=	new Body(-1000, -1000, 2, 2);
var mouseClickR	=	new Body(-1000, -1000, 2, 2);
mouseClickL.isClicked = false;
mouseClickR.isClicked = false;

var left, right;
left =  0;
right = 2;

function resetMouseL() {
	mouseClickL.x = -1000;
	mouseClickL.y = -1000;
	mouseClickL.height = 2;
	mouseClickL.width = 2;
	mouseClickL.isClicked = false;
}

function resetMouseR() {
	mouseClickR.x = -1000;
	mouseClickR.y = -1000;
	mouseClickR.height = 2;
	mouseClickR.width = 2;
	mouseClickR.isClicked = false;
}

//setting up left click
canvas.addEventListener('click', function (event) {
	selectedBodies = [];
	/*
	mouseClickL.x = event.pageX - canvas.offsetLeft;
	mouseClickL.y = event.pageY - canvas.offsetTop;
	mouseClickL.isClicked = true;
	console.log("mouseClickL"+JSON.stringify( mouseClickL.getTransform() ));
	return false;
	*/
}, false);

//setting up right click
canvas.addEventListener('contextmenu', function (event) {
	event.preventDefault();
	mouseClickR.x = event.pageX - canvas.offsetLeft;
	mouseClickR.y = event.pageY - canvas.offsetTop;
	mouseClickR.isClicked = true;
	console.log("mouseClickR: "+JSON.stringify( mouseClickR.getTransform() ));
	return false;
}, false);


//selecting rectange thing
var isMouseDown = false;

canvas.onmousedown = function(event) {
	mouseClickL.x = event.pageX - canvas.offsetLeft;
	mouseClickL.y = event.pageY - canvas.offsetTop;
	console.log("mouse down"+JSON.stringify( mouseClickL.getTransform() ));
	if(event.button === left){
		isMouseDown = true;
	}
}
var selectedBodies = [];
canvas.onmouseup = function(event) {
	if(event.button === left){
		mouseClickL.isClicked = true;
		isMouseDown = false;
	}
	for (var i in world.bodies){
		if(mouseClickL.isIntersect(world.bodies[i])){
			selectedBodies.push(world.bodies[i])
		}
	}
	if (mouseClickL.height < 0) {
		var h = -mouseClickL.height;
		var y = mouseClickL.y;
		mouseClickL.height = h;
		mouseClickL.y = y-h;

	}
	if (mouseClickL.width < 0) {
		var w = -mouseClickL.width;
		var x = mouseClickL.x;
		mouseClickL.width = w;
		mouseClickL.x = x-w;
	}
	console.log("mouse up"+JSON.stringify( mouseClickL.getTransform() ));
}
canvas.onmousemove = function(event) {
	if (!isMouseDown) { return false; }
	mouseClickL.width = event.pageX - mouseClickL.x - canvas.offsetLeft;
	mouseClickL.height = event.pageY - mouseClickL.y - canvas.offsetTop;
}

//initializing world
var world	=	new World(context);
world.renderRect = true;

//load all Sprites
var swordsmanSprite = new Image();
swordsmanSprite.src = "./assets/swordsman.png";

//initialize bodies and add to world
var player	=	new Body(0,100,50,50);
player.sprites.push(swordsmanSprite);
player.setCurrentSprite(0)
player.rectColor = "#f00"


var body1	=	new Body(0, 0, 50, 50);
body1.sprites.push(swordsmanSprite);
body1.setCurrentSprite(0)

var body2	=	new Body(11, 22, 50, 50);
body2.sprites.push(swordsmanSprite);
body2.setCurrentSprite(0)

var body3	=	new Body(22, 44, 50, 50);
body3.sprites.push(swordsmanSprite);
body3.setCurrentSprite(0)

world.addBodies(player);
world.addBodies(body1);
world.addBodies(body2);
world.addBodies(body3);

world.update(function () {
	updateAllBodies();
	resetMouseR();
});


function updateAllBodies() {
/*
 	for (var i in world.bodies) {
		world.bodies[i].y++;
		if( world.bodies[i].y >= 360 ) {
			world.bodies[i].y = -world.bodies[i].y/2;
		}
	}
	for (var i in world.bodies) {
		if(world.bodies[i].isIntersect(mouseClickL)){
			console.log("intersect: "+i+JSON.stringify(world.bodies[i].getTransform()));
			world.removeBuffer.push(world.bodies[i])
		}
	}
*/
	//drawing mouse
	world.canvasContext.clearRect(0,0,720,360);
	world.canvasContext.strokeStyle = "#00f";

	world.canvasContext.strokeRect(mouseClickL.x,
								   mouseClickL.y, 
								   mouseClickL.width,
								   mouseClickL.height);
	for(var i in world.bodies) {
		if( world.bodies[i].isIntersect(mouseClickL) ){
			selectedBodies.push(world.bodies[i]);
		}
		if( mouseClickR.isClicked === true && selectedBodies.indexOf(world.bodies[i]) != -1 ){
			world.bodies[i].setPosition(mouseClickR.x - world.bodies[i].width/2,
										mouseClickR.y - world.bodies[i].height/2);
		}
	}
	if( !isMouseDown ){
		resetMouseL();
	}
}
