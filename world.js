function World (canvasContext) {
	this.canvasContext = canvasContext;
	this.colors = ['#f00','#0f0','#00f'];
	this.bodies = [];
	
	this.addBodies = function (body) {
		this.bodies.push(body);
	};

	this.removeBody = function (body) {
		var index = this.bodies.indexOf(body);
		if (index > -1) {
			this.bodies.splice(index, 1);
		}
	}

	this.drawBodies = function () {
		var colorIndex = 0;

		this.canvasContext.clearRect(0, 0, 720, 360);
		for (let i in this.bodies) {
			if(colorIndex > this.colors.length -1) {
				colorIndex = 0;
			}
			this.canvasContext.strokeStyle = this.colors[i];
			this.canvasContext.strokeRect(this.bodies[i].x, this.bodies[i].y, this.bodies[i].width, this.bodies[i].height);
		}
	}
}
