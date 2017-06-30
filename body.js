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

	this.rectColor 		= "#000";
	this.hasGravity		=	false;
	this.hasCollision	=	false;

	this.removeFromWorld = () => {
		world.removeBuffer.push(this);
	}

	this.sprites 	= [];
	this.animations = {};
	this.currentSprite;

	this.setCurrentSprite = (index) => {
		this.currentSprite = this.sprites[index];
	}


	//index of spritesIndexList used in body.addAnimation()
	var spriteIndex = 0;

	//add new animation specifing it's name, indices of sprites stored in body.sprites[] and framerate of animation
	this.addAnimation = (name, spritesIndexList, framerate) => {
		//body.animations[<name>]() is called in each frame to update body.currentSprite, which is then rendered
		this.animations[name] = () => {
			if (world.currentFrame % framerate === 0) {
				if (spriteIndex > spritesIndexList.length - 1) { spriteIndex = 0; }
				this.setCurrentSprite(spritesIndexList[spriteIndex++]);
			}
		};
	};

	this.setCurrentAnimation = (animationName) => {
		this.currentAnimation = this.animations[animationName];
	};

	this.addAnimation('default', [0], 30);
	this.currentAnimation = this.animations.default;
	this.speed = 1;
	this.isMoving = false;

	//TODO dont initialize for each new object
	this.pathFinder = (new Pathfinder(world)).findPath;
	this.path = [];

	var resetTileWeights = () => {
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
		resetTileWeights();
		this.x = x;
		this.y = y;
		this.xTile = Math.floor(this.x / world.tileSize);
		this.yTile = Math.floor(this.y / world.tileSize);
	}

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
			this.isMoving = true;
		} else{
			if(this.path.length <= 0){
				this.isMoving = false;
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

	this.getTransform = () => {
		return {
			x:	this.xTile,
			y:	this.yTile,
			height:	this.height,
			width:	this.width
		}
	}
}
