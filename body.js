var  Body = function (x, y, width, height) {
	var self = this;
	this.x 		= 	x;
	this.y 		= 	y;
	this.width 	= 	width;
	this.height	= 	height;

	this.rectColor = "#000";
	
	//must be set explicitly
	this.hasGravity		=	false;
	this.hasCollision	=	false;

	this.setPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}

	this.sprites = [];
	this.currentSprite;

	this.setCurrentSprite = function (index) {
		self.currentSprite = self.sprites[index];
	}

	this.isIntersect = function (otherBody, log) {
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

	this.getTransform = function () {
		return {
			x:	this.x,
			y:	this.y,
			height:	this.height,
			width:	this.width
		}
	}
}
