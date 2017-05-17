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
	if(event.button === left){
		mouseClickL.x = event.pageX - canvas.offsetLeft;
		mouseClickL.y = event.pageY - canvas.offsetTop;
		console.log("mouse down"+JSON.stringify( mouseClickL.getTransform() ));
		isMouseDown = true;
	}
}
var selectedBodies = [];
canvas.onmouseup = function(event) {
	if(event.button === left){
		mouseClickL.isClicked = true;
		isMouseDown = false;
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
			mouseClickL.x = x - w;
		}
		console.log("mouse up"+JSON.stringify( mouseClickL.getTransform() ));
	}
}
canvas.onmousemove = function(event) {
	if (!isMouseDown) { return false; }
	if(event.button === left){
		mouseClickL.width = ( event.pageX - canvas.offsetLeft ) - mouseClickL.x;
		mouseClickL.height = ( event.pageY - canvas.offsetTop ) - mouseClickL.y;
	}
}

//initializing world
var world	=	new World(context);
world.renderRect = true;

//load all Sprites
var swordsmanSprite = new Image();
swordsmanSprite.src = "./assets/swordsman.png";

function SwordsMan(x,y,width,height,world){
	Body.call(this,x,y,width,height,world);
	SwordsMan.prototype = Object.create(Body.prototype);
	SwordsMan.prototype.constructor = SwordsMan;
	this.sprites.push(swordsmanSprite);
	this.setCurrentSprite(0);
	this.health = 100;
	this.player = 0;
	this.speed = 5;
}

//initialize bodies and add to world
var player1Bodies = [];
for (var i = 0, len = 5; i < len; i++) {
	var body =  new SwordsMan(i*50,300,50,50,world);

	body.rectColor = "#f00";
	player1Bodies.push(body)
	world.addBodies(body);
}

var aiBodies = [];
for (var i = 0, len = 5; i < len; i++) {
	var body =  new SwordsMan(i*50,0,50,50,world);

	body.rectColor = "#0f0";
	aiBodies.push(body)
	world.addBodies(body);
}


world.update(function () {
	updateAllBodies();
	resetMouseR();
	if( !isMouseDown ){
		resetMouseL();
	}
});

function updateAllBodies() {
	//drawing mouse
	world.canvasContext.clearRect(0,0,720,360);
	world.canvasContext.strokeStyle = "#00f";

	world.canvasContext.strokeRect(mouseClickL.x,
								   mouseClickL.y, 
								   mouseClickL.width,
								   mouseClickL.height);
	//loop through all bodies to handle selection and movement
	var selectedCount = 0;
	for(var i in world.bodies) {
		if( world.bodies[i].isIntersect(mouseClickL) ){
			if (player1Bodies.includes(world.bodies[i])){
				selectedBodies.push(world.bodies[i]);
			}
		}
		if( world.bodies[i].isMoving || ( mouseClickR.isClicked === true && selectedBodies.indexOf(world.bodies[i]) !== -1 ) ){
			if (selectedCount % 2 === 0){
				world.bodies[i].move(mouseClickR.x + (selectedCount*world.bodies[i].width) - world.bodies[i].width/2,
										    mouseClickR.y - world.bodies[i].height/2,
											world.bodies[i].speed);
			}else {
				world.bodies[i].move(mouseClickR.x - (selectedCount*world.bodies[i].width) - world.bodies[i].width/2,
										    mouseClickR.y - world.bodies[i].height/2,
											world.bodies[i].speed)
			}
			selectedCount++;
		}
	}

	for(var i in player1Bodies){
		for(var j in aiBodies){
			if(player1Bodies[i].isIntersect(aiBodies[j])){
				player1Bodies[i].health--;
				aiBodies[j].health--;
				if(player1Bodies[i].health < 0){
					player1Bodies[i].removeFromWorld();
				}
				if(aiBodies[j].health < 0){
					aiBodies[j].removeFromWorld();
				}
			}
		}
	}
	for(var i in world.removeBuffer){
		var index = player1Bodies.indexOf(world.removeBuffer[i]);
		if(index > -1){
			player1Bodies.splice(index, 1);
			continue;
		}
		var index = aiBodies.indexOf(world.removeBuffer[i]);
		if(index > -1){
			aiBodies.splice(index, 1);
			continue;
		}
	}

}
