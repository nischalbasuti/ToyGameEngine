function World (canvasContext) {
	var self = this;

	this.canvasContext = canvasContext;
	this.bodies = [];
	this.removeBuffer = [];
	this.worldRenderer = new WorldRenderer(this);

	this.renderRect = false;
	
	this.addBodies = function (body) {
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
}
