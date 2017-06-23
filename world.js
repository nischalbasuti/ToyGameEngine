"use strict";
function World (canvasContext) {
	this.canvasContext = canvasContext;
	this.bodies = [];

	this.height = canvasContext.canvas.height;
	this.width = canvasContext.canvas.width;

	//push bodies to this.removeBuffer to safely remove bodies in this.update()
	this.removeBuffer = [];

	this.worldRenderer = new WorldRenderer(this);
	this.renderRect = false;

	this.tileSize = 2;
	
	this.addBodies = (body) => {
		this.bodies.push(body);
	};


	this.removeBody = (body) => {
		console.log('removed: '+JSON.stringify(body))
		body.resetTileWeights();
		var index = this.bodies.indexOf(body);
		if (index > -1) {
			this.bodies.splice(index, 1);
		}
	};

	this.render = () => {
		this.worldRenderer.renderWorld();
	};

	this.FPS = 30;
	this.currentFrame = 0;
	//TODO: clean up
	this.update = (update) => {
		this.usersUpdate = update;
		this.innerUpdate = () => {
			this.currentFrame++;
			this.updateTiles();
			this.render();
			this.usersUpdate();
			for (var i in this.removeBuffer) {
				this.removeBody(this.removeBuffer[i]);
			}
			this.removeBuffer = [];

			requestAnimationFrame(this.innerUpdate);
		}
		requestAnimationFrame(this.innerUpdate)
	};
	this.updateTiles = () => {
		for(let body of this.bodies){
			body.currentAnimation();
			this.tiles[[body.xTile,body.yTile]].weight = Pathfinder.INFINITY;
			for(let i = 0; i < body.widthInTiles; i++){
				for(let j = 0; j < body.heightInTiles; j++){
					try{
						this.tiles[[body.xTile+i,body.yTile+j]].weight = 55;
					}catch(e){
						console.log(e.message+"\nthis is expected to happen if part of the body is off screen");
					}
				}
			}
		}
	}

	this.tiles = [];
	this.setupTiles = (tileSize, widthInTiles, heightInTiles) => {
		this.tileSize = tileSize;
		this.widthInTiles = widthInTiles;
		this.heightInTiles = heightInTiles;
		this.width = this.canvasContext.canvas.width = widthInTiles * tileSize;
		this.height = this.canvasContext.canvas.height = heightInTiles * tileSize;
		
		for(var i = 0; i < this.widthInTiles; i++){
			for(var j = 0; j < this.heightInTiles; j++){
				this.tiles[[i,j]] = new Tile(i,j,1);
			}
		}
	}
}
