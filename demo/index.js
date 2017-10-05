"use strict";
var canvas = document.getElementById('game_screen');
canvas.width = document.body.clientWidth - document.body.clientWidth/10 - canvas.offsetLeft;
canvas.height = document.body.clientHeight - document.body.clientHeight/10 - canvas.offsetTop;
var context = canvas.getContext('2d');

//setting mouse controls
//mouse clicks or implemented in game as Body objects and the Body.isIntersect is used to handle clicks
//TODO remove World dependency for mouseclick bodies
var mouseClickL =   new Body(-1000, -1000, 2, 2, new World(context));
var mouseClickR =   new Body(-1000, -1000, 2, 2, new World(context));
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
    mouseClickR.xTile = 0;
    mouseClickL.yTile = 0;
}

//setting up left click
canvas.addEventListener('click', function (event) {
    selectedBodies = [];
}, false);

//setting up right click
canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    mouseClickR.xTile = Math.floor( ( event.pageX - canvas.offsetLeft ) / world.tileSize);
    mouseClickR.yTile = Math.floor( ( event.pageY - canvas.offsetTop ) / world.tileSize);
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
var world   =   new World(context);
world.renderRect = true;

//TODO: Do all this stuff in World
world.setupTiles(32, 24, 14);

//load all Sprites

var settlementSprite = new Image();
settlementSprite.src = "./assets/building.png"

//initialize bodies and add to world
var player1Bodies = [];
var player1Settlement = new Settlement(world.width/2 - 64,world.height-128,128,128,world)
player1Settlement.setPlayer(1);
player1Bodies.push(player1Settlement);
world.addBody(player1Settlement);
for (var i = 0, len = 12; i < len; i++) {
    var body =  new SwordsMan(i*64,world.height - 192,32,32,world);
    body.setPlayer(1);

    player1Bodies.push(body)
    world.addBody(body);
}

var player2Bodies = [];
var aiSettlement = new Settlement(world.width/2 - 64,0,128,128,world);
aiSettlement.setPlayer(2);
player2Bodies.push(aiSettlement);
world.addBody(aiSettlement)
for (var i = 0, len = 12; i < len; i++) {
    var body =  new SwordsMan(i*64,128,32,32,world);
    body.setPlayer(2);

    player2Bodies.push(body)
    world.addBody(body);
}

world.update( () => {
    updateAllBodies();
    resetMouseR();
    if( !isMouseDown ){
        resetMouseL();
    }
});

function updateAllBodies() {
    
    //clearing screen
    world.canvasContext.fillStyle = "#fff";
//  world.canvasContext.fillRect(0,0,canvas.width,canvas.height);

    //drawing mouse
    world.canvasContext.strokeStyle = "#00f";
    world.canvasContext.strokeRect(mouseClickL.x,
                                   mouseClickL.y, 
                                   mouseClickL.width,
                                   mouseClickL.height);
    //loop through all bodies to handle selection and movement
    var selectedCount = 0;
    var columnCount = 0;
    var column = -1;
    var columnSize = 5;
    var rightSide = true;
    for(var body of world.bodies) {
        if(body.constructor === SwordsMan){
            if(body.health < 100){
                if(body.player === 1 && isIntersect(body, player1Settlement)){
                    body.health += 0.5;
                }
                if(body.player === 2 && isIntersect(body, aiSettlement)){
                    body.health += 0.5;
                }
            }
        }
        if( isIntersect(body, mouseClickL) ){
            if (player1Bodies.includes(body) && body.constructor !== Settlement){
                selectedBodies.push(body);
            }
        }
        if( body.isMoving || ( mouseClickR.isClicked === true && selectedBodies.indexOf(body) !== -1 ) ){
            body.setCurrentAnimation('walk');
            if(columnCount % columnSize === 0){ column++;selectedCount=0 }
            if(selectedCount % 2 === 0){
                body.move(mouseClickR.xTile+selectedCount, mouseClickR.yTile+column);
            }else {
                body.move(mouseClickR.xTile+selectedCount, mouseClickR.yTile+column);
            }
            selectedCount++;
            columnCount++;
        }else{
            body.setCurrentAnimation('default');
        }
    }

    for(var player1Body of player1Bodies){
        for(var player2Body of player2Bodies){
            if(isIntersect(player1Body, player2Body)){
                player1Body.health--;
                player2Body.health--;

                player1Body.setCurrentAnimation('fight');
                player2Body.setCurrentAnimation('fight');

                if(player1Body.health <= 0){
                    player1Body.removeFromWorld();
                }
                if(player2Body.health <= 0){
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
