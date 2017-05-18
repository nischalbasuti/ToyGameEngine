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

var settlementSprite = new Image();
settlementSprite.src = "./assets/building.png"

function SwordsMan(x,y,width,height,world){
	Body.call(this,x,y,width,height,world);
	SwordsMan.prototype = Object.create(Body.prototype);
	SwordsMan.prototype.constructor = SwordsMan;
	var self = this;
	self.sprites.push(swordsmanSprite);
	self.setCurrentSprite(0);
	self.health = 100;
	self.player = 0;
	self.speed = 5;
	self.setPlayer = function(playerIndex){
		switch (playerIndex) {
			case 1:
				self.player = 1;
				self.rectColor = "#f00";
				break;
			case 2:
				self.player = 2;
				self.rectColor = "#0f0";
				break;
			
			default:
				self.player = 0;
				self.rectColor = "#000";
				break;
		}
	}
}

function Settlement(x,y,width,height,world){
	Body.call(this,x,y,width,height,world);
	Settlement.prototype = Object.create(Body.prototype);
	Settlement.prototype.constructor = Settlement;
	var self = this;
	self.sprites.push(settlementSprite);
	self.setCurrentSprite(0);
	self.health = 1000;
	self.player = 0;
	self.speed = 0;
	self.setPlayer = function(playerIndex){
		switch (playerIndex) {
			case 1:
				self.player = 1;
				self.rectColor = "#f00";
				break;
			case 2:
				self.player = 2;
				self.rectColor = "#0f0";
				break;
			
			default:
				self.player = 0;
				self.rectColor = "#000";
				break;
		}
	}
}

//initialize bodies and add to world
var player1Bodies = [];
var player1Settlement = new Settlement(world.width/2 - 50,world.height-100,100,100,world)
player1Settlement.setPlayer(1);
player1Bodies.push(player1Settlement);
world.addBodies(player1Settlement);
for (var i = 0, len = 10; i < len; i++) {
	var body =  new SwordsMan(i*50,300,50,50,world);
	body.setPlayer(1);

	player1Bodies.push(body)
	world.addBodies(body);
	body.move(i*25+( world.width-len*50)/2,world.height -200);
}

var player2Bodies = [];
var aiSettlement = new Settlement(world.width/2 - 50,0,100,100,world);
aiSettlement.setPlayer(2);
player2Bodies.push(aiSettlement);
world.addBodies(aiSettlement)
for (var i = 0, len = 10; i < len; i++) {
	var body =  new SwordsMan(i*50,0,50,50,world);
	body.setPlayer(2);

	player2Bodies.push(body)
	world.addBodies(body);
	body.move(i*25+( world.width-len*25)/2,100);
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
		if(world.bodies[i].constructor === SwordsMan){
			if(world.bodies[i].health < 100){
				if(world.bodies[i].player === 1 && world.bodies[i].isIntersect(player1Settlement)){
					world.bodies[i].health += 0.5;
				}
				if(world.bodies[i].player === 2 && world.bodies[i].isIntersect(aiSettlement)){
					world.bodies[i].health += 0.5;
				}
			}
		}
		if( world.bodies[i].isIntersect(mouseClickL) ){
			if (player1Bodies.includes(world.bodies[i]) && world.bodies[i].constructor !== Settlement){
				selectedBodies.push(world.bodies[i]);
			}
		}
		if( world.bodies[i].isMoving || ( mouseClickR.isClicked === true && selectedBodies.indexOf(world.bodies[i]) !== -1 ) ){
			world.bodies[i].move(mouseClickR.x + (selectedCount*world.bodies[i].width) - selectedCount*world.bodies[i].width/2-selectedCount*world.bodies[i].width, mouseClickR.y - world.bodies[i].height/2);
			selectedCount++;
		}
	}

	for(var i in player1Bodies){
		for(var j in player2Bodies){
			if(player1Bodies[i].isIntersect(player2Bodies[j])){
				player1Bodies[i].health--;
				player2Bodies[j].health--;
				if(player1Bodies[i].health < 0){
					player1Bodies[i].removeFromWorld();
				}
				if(player2Bodies[j].health < 0){
					player2Bodies[j].removeFromWorld();
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
		var index = player2Bodies.indexOf(world.removeBuffer[i]);
		if(index > -1){
			player2Bodies.splice(index, 1);
			continue;
		}
	}

}
