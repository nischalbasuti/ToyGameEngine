var  Body = function (x, y, width, height, world) {
	var self = this;
	self.x 		= 	x;
	self.y 		= 	y;
	self.width 	= 	width;
	self.height	= 	height;

	self.xTile = x;
	self.yTile = y;

	self.rectColor = "#000";
	
	//must be set explicitly
	self.hasGravity		=	false;
	self.hasCollision	=	false;

	self.setPosition = function (x, y) {
		self.x = x;
		self.y = y;
	}

	self.sprites = [];
	self.currentSprite;

	self.removeFromWorld = function(){
		world.removeBuffer.push(self);
	}

	self.setCurrentSprite = function (index) {
		self.currentSprite = self.sprites[index];
	}

	self.isIntersect = function (otherBody, log) {
		//IMP: canvas is represented as being in the 4th Quadrant, so y is -ve
		if (log === true) {
			console.log(otherBody);
		}

		var xLeft 	= 	self.x;
		var yTop	=	-self.y;
		
		var xRight		= 	self.x + self.width;
		var yBottom		=	-(self.y + self.height);

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

	self.getTransform = function () {
		return {
			x:	self.xTile,
			y:	self.yTile,
			height:	self.height,
			width:	self.width
		}
	}

	self.isMoving = false;
	self.destinationX = 0;
	self.destinationY = 0;

	self.stepX = 0;
	self.stepY = 0;

	self.speed = 1;

	self.destBody = null;
	self.path = [];

	self.pathFinder = (new Pathfinder(world)).findPath

	self.move = function(x, y){
		if(!self.isMoving){
			self.xTile = Math.floor(self.x / world.tileSize);
			self.yTile = Math.floor(self.y / world.tileSize);

			//handle edge cases #puns
			if(x < 0) x = 0;
			if(y < 0) x = 0;
			if(x >= world.widthInTiles) x = world.widthInTiles-1;
			if(y >= world.heightInTiles) y = world.heightInTiles-1;

			self.path = self.pathFinder(world.tiles[[self.xTile,self.yTile]],world.tiles[[x,y]]);
			self.isMoving = true;
		} else{
			if(self.path.length <= 0){
				self.isMoving = false;
				return;
			}
		}
		var nextTile = self.path.pop();
		self.setPosition(nextTile.x*world.tileSize, nextTile.y*world.tileSize);
	}
}
