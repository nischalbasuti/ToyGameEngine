var canvas = document.getElementById('game_screen');
canvas.width = document.body.clientWidth - document.body.clientWidth/10 - canvas.offsetTop;
canvas.height = document.body.clientHeight - document.body.clientHeight/10 - canvas.offsetTop;
var context = canvas.getContext('2d');

var backgroundTexture = new Image();
backgroundTexture.src = "./assets/grasstexture.jpg";
var backgroundPattern = context.createPattern(backgroundTexture, "repeat");

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

//TODO: Do all this stuff in World
world.tileSize = 5;
world.width = world.tileSize * 150;
world.height = world.tileSize * 90;
world.widthInTiles = world.width/world.tileSize;
world.heightInTiles = world.height/world.tileSize;
canvas.width = world.width;
canvas.height = world.height;

//load all Sprites
var swordsmanSprite = new Image();
swordsmanSprite.src = "./assets/swordsman.png";

var settlementSprite = new Image();
settlementSprite.src = "./assets/building.png"

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
	
	//clearing screen
	world.canvasContext.fillStyle = "#d8fff9";
	world.canvasContext.fillRect(0,0,canvas.width,canvas.height);

	//drawing mouse
	world.canvasContext.strokeStyle = "#00f";
	world.canvasContext.strokeRect(mouseClickL.x,
								   mouseClickL.y, 
								   mouseClickL.width,
								   mouseClickL.height);
	//loop through all bodies to handle selection and movement
	var selectedCount = 0;
	var columnCount = 0;
	var column = 0;
	var columnSize = 5;
	for(var body of world.bodies) {
		if(body.constructor === SwordsMan){
			if(body.health < 100){
				if(body.player === 1 && body.isIntersect(player1Settlement)){
					body.health += 0.5;
				}
				if(body.player === 2 && body.isIntersect(aiSettlement)){
					body.health += 0.5;
				}
			}
		}
		if( body.isIntersect(mouseClickL) ){
			if (player1Bodies.includes(body) && body.constructor !== Settlement){
				selectedBodies.push(body);
			}
		}

		if( body.isMoving || ( mouseClickR.isClicked === true && selectedBodies.indexOf(body) !== -1 ) ){
			if(columnCount % columnSize === 0){ column++;selectedCount=0 }
			if(selectedCount%2===0){
				body.move(mouseClickR.x - body.width - selectedCount*body.width/2, 
				mouseClickR.y - body.height*2 + column*body.height);
			}else {
				body.move(mouseClickR.x - body.width + selectedCount*body.width/2, 
				mouseClickR.y - body.height*2 + column*body.height);
			}
			selectedCount++;
			columnCount++;
		}
	}

	for(var player1Body of player1Bodies){
		for(var player2Body of player2Bodies){
			if(player1Body.isIntersect(player2Body)){
				player1Body.health--;
				player2Body.health--;
				if(player1Body.health < 0){
					player1Body.removeFromWorld();
				}
				if(player2Body.health < 0){
					player2Body.removeFromWorld();
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
