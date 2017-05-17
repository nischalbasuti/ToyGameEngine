var WorldRenderer = function (world) {
	this.renderWorld = function () {
		//world.canvasContext.clearRect(0, 0, 720, 360);
		for (let i in world.bodies) {
			if (world.renderRect === true){
				world.canvasContext.strokeStyle = world.bodies[i].rectColor;

				//draw rectangles to canvas
				world.canvasContext.strokeRect(world.bodies[i].x,
					world.bodies[i].y, 
					world.bodies[i].width, 
					world.bodies[i].height);
				if(world.bodies[i].destBody != null){
					world.canvasContext.strokeRect(world.bodies[i].destBody.x,
						world.bodies[i].destBody.y, 
						world.bodies[i].destBody.width, 
						world.bodies[i].destBody.height);
				}
			}
			//draw sprite to canvas
			world.canvasContext.drawImage(world.bodies[i].currentSprite,
										  world.bodies[i].x,
										  world.bodies[i].y,
										  world.bodies[i].width,
										  world.bodies[i].height
										  );
		}
	}
}
