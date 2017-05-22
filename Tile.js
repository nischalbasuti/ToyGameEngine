function Tile(x, y, tileSize){
	this.x = x;
	this.y = y;
	this.side = tileSize;
	this.getIndex = function(){
		return [this.x, this.y];
	}
}
