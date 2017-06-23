"use strict";
var  Body = function (x, y, width, height, world) {
	this.x 		= 	x;
	this.y 		= 	y;
	this.width 	= 	width;
	this.height	= 	height;

	this.widthInTiles = Math.floor(width / world.tileSize);
	this.heightInTiles = Math.floor(height / world.tileSize);

	this.xTile = Math.floor(this.x / world.tileSize);
	this.yTile = Math.floor(this.y / world.tileSize);

	this.rectColor = "#000";
	
	//must be set explicitly
	this.hasGravity		=	false;
	this.hasCollision	=	false;

	 this.resetTileWeights = () => {
		for(let i = 0; i < this.widthInTiles; i++){
			for(let j = 0; j < this.heightInTiles; j++){
				try{
					world.tiles[[this.xTile+i,this.yTile+j]].weight = 1;
				}catch(e){
					//TODO
						console.log(e.message);
				}
			}
		}
	}
	this.setPosition =  (x, y) => {
		//resetting previous tile weights
		this.resetTileWeights();
		this.x = x;
		this.y = y;
		this.xTile = Math.floor(this.x / world.tileSize);
		this.yTile = Math.floor(this.y / world.tileSize);
	}

	this.sprites = [];
	this.currentSprite;

	this.setCurrentSprite = (index) => {
		this.currentSprite = this.sprites[index];
	}

	this.removeFromWorld = () => {
		world.removeBuffer.push(this);
	}

	this.animations = {};

	var spriteIndex = 0;
	this.addAnimation = (name, spritesIndexList, framerate) => {
		this.animations[name] = () => {
			if(world.currentFrame % framerate === 0){
				if(spriteIndex > spritesIndexList.length - 1){
					spriteIndex = 0;
				}
				this.setCurrentSprite(spritesIndexList[spriteIndex++]);
			}
		};
	};
	this.addAnimation('default', [0], 30);
	this.currentAnimation = this.animations.default;

	this.isIntersect = (otherBody, log) => {
		//IMP: canvas is represented as being in the 4th Quadrant, so y is -ve
		if (log === true) {
			console.log(otherBody);
		}

		var xLeft 	= 	this.x;
		var yTop	=	-this.y;
		
		var xRight		= 	this.x + this.width;
		var yBottom		=	-(this.y + this.height);

		var otherBodyXLeft	=	otherBody.x;
		var otherBodyYTop	=	-otherBody.y;

		var otherBodyXRight		=	otherBody.x + otherBody.width;
		var otherBodyYBottom	=	-(otherBody.y + otherBody.height);


		if (xLeft > otherBodyXRight || otherBodyXLeft > xRight) {
			return false;
		}

		if (yBottom > otherBodyYTop || otherBodyYBottom > yTop) {
			return false;
		}

		return true;
	}

	this.getTransform = () => {
		return {
			x:	this.xTile,
			y:	this.yTile,
			height:	this.height,
			width:	this.width
		}
	}

	this.isMoving = false;
	this.destinationX = 0;
	this.destinationY = 0;

	this.stepX = 0;
	this.stepY = 0;

	this.speed = 1;

	this.destBody = null;
	this.path = [];

	//TODO dont initialize for each new object
	this.pathFinder = (new Pathfinder(world)).findPath;

	var nextTile = undefined;
	this.move = (x, y) => {
		if(!this.isMoving){
			this.xTile = Math.floor(this.x / world.tileSize);
			this.yTile = Math.floor(this.y / world.tileSize);

			//handle edge cases #puns
			if(x < 0) x = 0;
			if(y < 0) x = 0;
			if(x >= world.widthInTiles) x = world.widthInTiles-1;
			if(y >= world.heightInTiles) y = world.heightInTiles-1;

			this.path = this.pathFinder(world.tiles[[this.xTile,this.yTile]],world.tiles[[x,y]]);
			this.destBody = new Body(x*world.tileSize, y*world.tileSize, world.tileSize, world.tileSize, world);
			this.isMoving = true;
		} else{
			if(this.path.length <= 0){
				this.isMoving = false;
				this.destBody = undefined;
				return;
			}
		}

		if(world.currentFrame % this.speed === 0){
			var nextTile = this.path.pop();
			if(nextTile === undefined) return;
			this.setPosition(nextTile.x*world.tileSize, nextTile.y*world.tileSize);
		}else{
			//interpolation
			if(this.path.length > 0){
				if(this.x < this.path[this.path.length-1].x*world.tileSize){
					this.setPosition(this.x + world.tileSize/this.speed, this.y);
				}
				else if(this.x > this.path[this.path.length-1].x*world.tileSize){
					this.setPosition(this.x - world.tileSize/this.speed, this.y);
				}
				if(this.y < this.path[this.path.length-1].y*world.tileSize){
					this.setPosition(this.x, this.y + world.tileSize/this.speed);
				}
				else if(this.y > this.path[this.path.length-1].y*world.tileSize){
					this.setPosition(this.x, this.y - world.tileSize/this.speed);
				}
			}
		}
	}
}
