"use strict";

function Unit(x, y, width, height, world) {
    var _this = this;

    Body.call(this, x, y, width, height, world);
    Unit.prototype = Object.create(Body.prototype);
    Unit.prototype.constructor = Unit;

    this.player = 0;
    this.rectColor = "#00f";
    this.setPlayer = function (playerIndex) {
        switch (playerIndex) {
            case 1:
                _this.player = 1;
                _this.rectColor = "#f00";
                break;
            case 2:
                _this.player = 2;
                _this.rectColor = "#0f0";
                break;
        }
    };
}