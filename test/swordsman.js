"use strict";
function SwordsMan(x,y,width,height,world){
    Unit.call(this,x,y,width,height,world);
    SwordsMan.prototype = Object.create(Unit.prototype);
    SwordsMan.prototype.constructor = SwordsMan;

    var swordsmanSprite = new Image();
    swordsmanSprite.src = "./assets/swordsman.png";

    var swordsmanSprite1 = new Image();
    swordsmanSprite1.src = "./assets/swordsman1.png";

    this.sprites.push(swordsmanSprite);
    this.sprites.push(swordsmanSprite1);
    this.setCurrentSprite(0);

    this.health = 100;
    this.speed = 10;

    this.addAnimation('walk', [0,1], this.speed);
}
