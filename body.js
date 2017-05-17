var  Body = function (x, y, width, height, world) {
	var self = this;
	self.x 		= 	x;
	self.y 		= 	y;
	self.width 	= 	width;
	self.height	= 	height;

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
			x:	self.x,
			y:	self.y,
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
	self.move = function(x, y, speed){
		if(self.x > world.width){
			self.x = world.width - 0.1 - self.width;
			self.isMoving = false;
			return;
		}
		if(self.y > world.height){
			self.y = world.height - 0.1 - self.width;
			self.isMoving = false;
			return;
		}
		if(self.x < 0){
			self.x = 0.1;
			self.isMoving = false;
			return;
		}
		if(self.y < 0){
			self.y = 0.1;
			self.isMoving = false;
			return;
		}
		if (self.isMoving === false){
			self.isMoving = true;
			self.destinationX = x + self.width/2;
			self.destinationY = y + self.height/2;

			self.stepX = ( self.destinationX - self.x )*speed/100;
			self.stepY = ( self.destinationY - self.y )*speed/100;
			self.destBody = new Body(self.destinationX, self.destinationY, 2, 2);
		}
		if (self.isIntersect(self.destBody)){
			self.isMoving = false;
		}
		self.setPosition(self.x+self.stepX, self.y+self.stepY)
	}
}
