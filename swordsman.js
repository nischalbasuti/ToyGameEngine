function SwordsMan(x,y,width,height,world){
	Unit.call(this,x,y,width,height,world);
	SwordsMan.prototype = Object.create(Unit.prototype);
	SwordsMan.prototype.constructor = SwordsMan;

	var self = this;
	self.sprites.push(swordsmanSprite);
	self.setCurrentSprite(0);
	self.health = 100;
	self.speed = 3;
}
