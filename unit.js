"use strict";
function Unit(x,y,width,height,world){
	Body.call(this,x,y,width,height,world);
	Unit.prototype = Object.create(Body.prototype);
	Unit.prototype.constructor = Unit;

	var self = this;
	self.player = 0;
	self.setPlayer = function(playerIndex){
		switch (playerIndex) {
			case 1:
				self.player = 1;
				self.rectColor = "#f00";
				break;
			case 2:
				self.player = 2;
				self.rectColor = "#0f0";
				break;
			
			default:
				self.player = 0;
				self.rectColor = "#000";
				break;
		}
	}
}
