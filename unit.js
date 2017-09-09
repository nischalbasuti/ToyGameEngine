"use strict";
function Unit(x,y,width,height,world){
    Body.call(this,x,y,width,height,world);
    Unit.prototype = Object.create(Body.prototype);
    Unit.prototype.constructor = Unit;

    this.player = 0;
    this.setPlayer = (playerIndex) => {
        switch (playerIndex) {
            case 1:
                this.player = 1;
                this.rectColor = "#f00";
                break;
            case 2:
                this.player = 2;
                this.rectColor = "#0f0";
                break;
            
            default:
                this.player = 0;
                this.rectColor = "#000";
                break;
        }
    }
}
