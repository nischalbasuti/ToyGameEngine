"use strict";
function Settlement(x,y,width,height,world){
	Unit.call(this,x,y,width,height,world);
	Settlement.prototype = Object.create(Unit.prototype);
	Settlement.prototype.constructor = Settlement;

	var self = this;
	self.sprites.push(settlementSprite);
	self.setCurrentSprite(0);
	self.health = 1000;
	self.speed = 0;
}
