function Tile(x, y, weight, tileSize){
	this.x = x;
	this.y = y;
	this.weight = weight;
	this.side = tileSize;
	this.getIndex = function(){
		return [this.x, this.y];
	}
}
