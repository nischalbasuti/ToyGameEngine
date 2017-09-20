# ToyGameEngine
2D Game Engine written from scratch in JavaScript (ECMAScript 6).

- [Getting Started](https://github.com/nischalbasuti/ToyGameEngine/tree/master#getting-started "Getting Started")
- [Defining game objects and adding them to the world](https://github.com/nischalbasuti/ToyGameEngine/tree/master#defining-game-objects-and-adding-them-to-the-world "Defining game objects and adding them to the world")
- [Collision Detection and Raycasting](https://github.com/nischalbasuti/ToyGameEngine/tree/master#collision-detection "Collision Detection and Raycasting")
- [Pathfinding](https://github.com/nischalbasuti/ToyGameEngine/tree/master#pathfinding "Pathfinding")
- [Building Project](https://github.com/nischalbasuti/ToyGameEngine/tree/master#building-project "Building Project")

## Getting Started

Clone the ToyGameEngine project.
```bash
git clone https://github.com/nischalbasuti/ToyGameEngine.git
```
Make ```index.html``` and ```index.js``` files.
Add a canvas element to ```index.html```.
```html
<canvas id='game_screen' style='border:1px solid #000'></canvas>
```
Now add the game engine scripts to ```index.html``` followed by your ```index.js``` you've just created.
```html
<!--Game Engine Scripts-->
<script src="ToyGameEngine/build.min.js "type="text/javascript" charset="utf-8"></script>
<!--Game Scripts-->
<script src="index.js" type="text/javascript"  charset="utf-8"></script>
```
Resize the canvas and initialize your game world in ```index.js```.
```javascript
var canvas = document.getElementById('game_screen');
var context = canvas.getContext('2d');

//set canvas dimensions
canvas.width = document.body.clientWidth - document.body.clientWidth/10 - canvas.offsetTop;
canvas.height = document.body.clientHeight - document.body.clientHeight/10 - canvas.offsetTop;

var world = new World(context);
world.setupTiles(32, 24, 14);   //set the size of each tile, 
                                //number of tiles horizontally and number of tiles vertically
```
## Defining game objects and adding them to the world
Define your game objects, inheriting from the Unit() constructor function.
```javascript
function MyObject(x,y,width,height,world){
    Unit.call(this,x,y,width,height,world);
    MyObject.prototype = Object.create(Unit.prototype);
    MyObject.prototype.constructor = MyObject;
    
    //add what ever attributes you need for your game object
    this.health = 100;
    this.speed = 3;
    
    //load the sprites (you might want to cache them somewhere else outside this object)
    var myObjectSprite = new Image();
    myObjectSprite.src = "./assets/myObjectFacingRight.png";

    var myObjectRightSprite = new Image();
    myObjectRightSprite.src = "./assets/myObjectFacingRight.png";

    var myObjectLeftSprite = new Image();
    myObjectLeftSprite.src = "./assets/myObjectFacingLeft.png";

    //add the sprites
    this.sprites.push(myBodySprite);
    this.sprites.push(myBodyRightSprite);
    this.sprites.push(myBodyLeftSprite);
    
    //set the initial starting sprite
    this.setCurrentSprite(0);
    
    //define animations using index of sprites you've loaded earlier and set the frame rate
    this.addAnimation('walk', [0,1,2], this.speed);
}
```
Now initialize your object and add it to the game world.
```javascript
var player =  new MyObject(world.width / 2, world.height / 2, 32, 32, world);
world.addBody(player);
```
Now we have to pass a callback function to ```world.update()``` which will run before rendering each frame.
We will also add some functionality for moving our player.
```javascript
world.update( () => {
    switch (keyEvent.key) {
        case 'ArrowDown':
            player.setPosition(player.x,player.y+player.speed);
            player.setCurrentAnimation('walk');
            break;
        case 'ArrowUp':
            player.setPosition(player.x,player.y-player.speed);
            player.setCurrentAnimation('walk');
            break;
        case 'ArrowLeft':
            player.setPosition(player.x-player.speed,player.y);
            player.setCurrentAnimation('walk');
            break;
        case 'ArrowRight':
            player.setPosition(player.x+player.speed,player.y);
            player.setCurrentAnimation('walk');
            break;
        default:
            player.setCurrentAnimation('default');
            break;
    }
} );
```
## Collision Detection
Create a ```Food``` constructor function similar to that of ```MyObject```.
let us create 3 food objects and define a score variable to store our score.
```javascript
var score = 0;

var food1 = new Food(world.width / 2, world.height / 4, 32, 32, world);
var food2 = new Food(world.width / 4, world.height / 4, 32, 32, world);
var food3 = new Food(world.width / 6, world.height / 4, 32, 32, world);

world.addBody(food1);
world.addBody(food2);
world.addBody(food3);
```
To check for collision, we use ```isIntersect``` function. We now add the following code to the update function from above.
```javascript
world.update( () => {
    ...
    ...
    ...
    for (let body of world.bodies) {
        if(isIntersect(player, body) && body !== player){
            body.removeFromWorld(); //remove food eaten from world
            score++;
        }
    }
} );
```
## Pathfinding
We can find paths for our objects using the ```move()``` method in the ```Body``` constructor function.
The ```Body.isMoving``` variable can be used to check if the body is moving.

The ```move``` method takes the x and y coordinates in terms of the tiles we defined when instantiating ```world```.

This should be called in the callback we send to ```world.update()```.
Ex:
```javascript
...
player.move(2, 4); //call this somewhere so that player.isMoving is set to 'true'
...
world.update( ()=> {
  ...
  ...
  if(player.isMoving) {
    player.move(2, 4);
  }
  ...
  ...
});
```

## Building Project
To install dev tools run:
```
npm install
```
Now we have to transpile the ES6 files in ```src``` to ES2015 using babel, these files will be generated in the ```public``` directory.
After that we have to minify the files in ```public``` to a singe file, we'll be doing this using ```grunt```.

To do all this, run the following:
```
npm run min
```
