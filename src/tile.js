"use strict";
function Tile(x, y, weight, tileSize){
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.side = tileSize;
    this.getIndex = () => {
        return [this.x, this.y];
    }
}
