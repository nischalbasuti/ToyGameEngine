var canvas = document.getElementById('game_screen');
var context = canvas.getContext('2d');

var world	=	new World(context);

var player	=	new Body(0,-100,50,50);
var body1	=	new Body(0, 0, 11, 22);
var body2	=	new Body(11, 22, 22, 44);
var body3	=	new Body(22, 44, 44, 88);

world.addBodies(player);
world.addBodies(body1);
world.addBodies(body2);
world.addBodies(body3);

function update() {
	for (var i in world.bodies) {
		world.bodies[i].y++;
		if( world.bodies[i].y >= 360 ) {
			world.bodies[i].y = -world.bodies[i].y/2;
		}
	}
	world.drawBodies();
	requestAnimationFrame(update);
}
requestAnimationFrame(update);
