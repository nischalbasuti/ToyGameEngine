"use strict";
function SwordsMan(x,y,width,height,world){
    Unit.call(this,x,y,width,height,world);
    SwordsMan.prototype = Object.create(Unit.prototype);
    SwordsMan.prototype.constructor = SwordsMan;

    this.sprites.push(swordsmanSprite);
    this.sprites.push(swordsmanSprite1);
    this.setCurrentSprite(0);

    this.health = 100;
    this.speed = 10;

    this.addAnimation('walk', [0,1], this.speed);
}
