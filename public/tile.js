"use strict";

function Tile(x, y, weight, tileSize) {
    var _this = this;

    this.x = x;
    this.y = y;
    this.weight = weight;
    this.side = tileSize;
    this.getIndex = function () {
        return [_this.x, _this.y];
    };
}