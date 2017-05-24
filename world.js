function World (canvasContext) {
	var self = this;

	self.canvasContext = canvasContext;
	self.bodies = [];

	self.height = canvasContext.canvas.height;
	self.width = canvasContext.canvas.width;

	//push bodies to self.removeBuffer to safely remove bodies in self.update()
	self.removeBuffer = [];

	self.worldRenderer = new WorldRenderer(this);
	self.renderRect = false;

	self.tileSize = 2;
	
	self.addBodies = function (body) {
		this.bodies.push(body);
	};

	self.currentFrame = 0;

	self.removeBody = function (body) {
		console.log('removed: '+JSON.stringify(body))
		body.resetTileWeights();
		var index = self.bodies.indexOf(body);
		if (index > -1) {
			self.bodies.splice(index, 1);
		}
	};

	self.render = function () {
		self.worldRenderer.renderWorld();
	};

	self.FPS = 30;
	//TODO: clean up
	self.update = function (update) {
		self.usersUpdate = update;
		self.innerUpdate = function () {
			self.render();
			self.usersUpdate();
			for (var i in self.removeBuffer) {
				self.removeBody(self.removeBuffer[i]);
			}
			self.removeBuffer = [];
			self.updateTiles();

			requestAnimationFrame(self.innerUpdate);
		}
		requestAnimationFrame(self.innerUpdate)
	};
	self.updateTiles = function(){
		for(let body of self.bodies){
			self.tiles[[body.xTile,body.yTile]].weight = Pathfinder.INFINITY;
			for(let i = 0; i < body.widthInTiles; i++){
				for(let j = 0; j < body.heightInTiles; j++){
					try{
						self.tiles[[body.xTile+i,body.yTile+j]].weight = Pathfinder.INFINITY;
					}catch(e){
						console.log(e.message+"\nthis is expected to happen if part of the body is off screen");
					}
				}
			}
		}
	}

	self.tiles = [];
	self.setupTiles = function(tileSize, widthInTiles, heightInTiles){
		self.tileSize = tileSize;
		self.widthInTiles = widthInTiles;
		self.heightInTiles = heightInTiles;
		self.width = self.canvasContext.canvas.width = widthInTiles * tileSize;
		self.height = self.canvasContext.canvas.height = heightInTiles * tileSize;
		
		for(var i = 0; i < self.widthInTiles; i++){
			for(var j = 0; j < self.heightInTiles; j++){
				self.tiles[[i,j]] = new Tile(i,j,1);
			}
		}
	}
}
