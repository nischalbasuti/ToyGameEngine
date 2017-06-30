function isIntersect (bodyA, bodyB, log) {
	//IMP: canvas is represented as being in the 4th Quadrant, so y is -ve
	if (log === true) {
		console.log(bodyB);
	}

	var bodyAXLeft 		= 	bodyA.x;
	var bodyAYTop		=	-bodyA.y;
	var bodyAXRight		= 	bodyA.x + bodyA.width;
	var bodyAYBottom	=	-(bodyA.y + bodyA.height);

	var bodyBXLeft		=	bodyB.x;
	var bodyBYTop		=	-bodyB.y;
	var bodyBXRight		=	bodyB.x + bodyB.width;
	var bodyBYBottom	=	-(bodyB.y + bodyB.height);

	if (bodyAXLeft > bodyBXRight || bodyBXLeft > bodyAXRight) {
		return false;
	}

	if (bodyAYBottom > bodyBYTop || bodyBYBottom > bodyAYTop) {
		return false;
	}

	return true;
}
