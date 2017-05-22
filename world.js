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

	self.removeBody = function (body) {
		console.log('removed: '+JSON.stringify(body))
		var index = self.bodies.indexOf(body);
		if (index > -1) {
			self.bodies.splice(index, 1);
		}
	};

	self.render = function () {
		self.worldRenderer.renderWorld();
	};

	//TODO: clean up
	self.update = function (update) {
		self.usersUpdate = update;
		self.innerUpdate = function () {
			self.usersUpdate();
			self.render();
			for (var i in self.removeBuffer) {
				self.removeBody(self.removeBuffer[i]);
			}
			self.removeBuffer = [];

			requestAnimationFrame(self.innerUpdate);
		}
		requestAnimationFrame(self.innerUpdate)
	};

	self.tiles = [];
	self.setupTiles = function(tileSize, widthInTiles, heightInTiles){
		self.tileSize = tileSize;
		self.widthInTiles = widthInTiles;
		self.heightInTiles = heightInTiles;
		self.width = self.canvasContext.canvas.width = widthInTiles * tileSize;
		self.height = self.canvasContext.canvas.height = heightInTiles * tileSize;
		
		for(var i = 0; i < self.widthInTiles; i++){
			for(var j = 0; j < self.heightInTiles; j++){
				self.tiles[[i,j]] = new Tile(i,j);
			}
		}
	}
}
