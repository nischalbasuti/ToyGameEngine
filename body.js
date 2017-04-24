var  Body = function (x, y, width, height) {
	this.x 		= 	x;
	this.y 		= 	y;
	this.width 	= 	width;
	this.height	= 	height;
	
	//must be set explicitly
	this.hasGravity		=	false;
	this.hasCollision	=	false;

	this.setPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}

	this.isIntersect = function (otherBody, log) {
		if (log === true) {
			console.log(otherBody);
		}

		var xTop 	= 	this.x + height;
		var yTop	=	this.y + width;

		var otherBodyXTop	=	otherBody.x + otherBody.height;
		var otherBodyYTop	=	otherBody.y + otherBody.width;

		if (this.x > otherBodyXTop || otherBody.x > xTop) {
			return false;
		}

		if (this.y > otherBodyYTop || otherBody.y > yTop) {
			return false;
		}

		return true;
	}
}
