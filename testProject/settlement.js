"use strict";
function Settlement(x,y,width,height,world){
	Unit.call(this,x,y,width,height,world);
	Settlement.prototype = Object.create(Unit.prototype);
	Settlement.prototype.constructor = Settlement;

	this.sprites.push(settlementSprite);
	this.setCurrentSprite(0);
	this.health = 1000;
	this.speed = 0;
}
