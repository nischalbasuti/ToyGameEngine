"use strict";
function Pathfinder(world){
	var self = this;
	var INFINITY = 1000000000;
	self.INFINITY = INFINITY;

	function reconstructPath(cameFrom, current){
		var totalPath = [];
		totalPath.push(current)
		world.canvasContext.lineWidth = world.tileSize;
		world.canvasContext.fillStyle = "#00f";
		for(let i in cameFrom){
			try{
				//TODO: find out how why undefined is coming
				if(cameFrom[current.getIndex()] === undefined){
					continue;
				}
				current = cameFrom[current.getIndex()];
				totalPath.push(current);
			} catch(e){
				console.log("ERROR: "+e.message + "\n for index: "+i)
			}
		}
		for(let current of totalPath){
			world.canvasContext.fillRect(current.x*world.tileSize,current.y*world.tileSize,world.tileSize,world.tileSize)
		}
		return totalPath;
	}
	function getMinFscore(openSet, fScore){
		//console.log("poped:"+fScore.data[0][0]);
		do{
			var lowest = fScore.pop();
			var index = openSet.indexOf(world.tiles[lowest]);
		}while(index === -1)

		return {
			'value': lowest,
			'index': index
		};
	}
	self.heuristicCostEstimate = function (startTile, endTile){
		//euclidian distance
		return Math.sqrt(Math.pow(startTile.x - endTile.x, 2) + Math.pow(startTile.y - endTile.y, 2));
		//diagonal distance
		return Math.max(Math.abs(startTile.x - endTile.x), Math.abs(startTile.y - endTile.y));
		//manhattan distance
		return Math.abs(startTile.x - endTile.x) + Math.abs(startTile.y - endTile.y);
	}

	self.findNeighbours = function(tile) {
		var neighbours = [];
		if(tile.x-1 >= 0){
			var node = world.tiles[ [tile.x-1, tile.y] ];
			neighbours.push(node);
		}
		if(tile.x+1 < world.widthInTiles){
			var node = world.tiles[ [tile.x+1, tile.y] ];
			neighbours.push(node);
		}
		if(tile.y-1 >= 0){
			var node = world.tiles[ [tile.x, tile.y-1] ];
			neighbours.push(node);
		}
		if(tile.y+1 < world.heightInTiles){
			var node = world.tiles[ [tile.x, tile.y+1] ];
			neighbours.push(node);
		}
		
		if(tile.x-1 >= 0 && tile.y-1 >= 0){
			var node = world.tiles[ [tile.x-1, tile.y-1] ];
			neighbours.push(node);
		}
		if(tile.x+1 < world.widthInTiles && tile.y+1 < world.heightInTiles){
			var node = world.tiles[ [tile.x+1, tile.y+1] ];
			neighbours.push(node);
		}
		if(tile.x-1 >=0 && tile.y+1 < world.heightInTiles){
			var node = world.tiles[ [tile.x-1, tile.y+1] ];
			neighbours.push(node);
		}
		if(tile.x+1 < world.widthInTiles && tile.y-1 >= 0){
			var node = world.tiles[ [tile.x+1, tile.y-1] ];
			neighbours.push(node);
		}
		return neighbours;
	}

	self.findPath = function(startTile, endTile){
		var closedSet = [];
		var openSet = [];
		openSet.push(startTile);
		var cameFrom = [];

		var gScore = [];
		var fScore = new PriorityQueue();
		for(var i in world.tiles) {
			gScore[i] = INFINITY;
		}
		gScore[startTile.getIndex()] = 0;
		fScore.push(startTile.getIndex(), self.heuristicCostEstimate(startTile, endTile));

		while(openSet.length > 0){
			var current = openSet[getMinFscore(openSet,fScore).index];
			
			if (current === endTile){
				return reconstructPath(cameFrom, current);
			}

			world.canvasContext.lineWidth = world.tileSize;
			world.canvasContext.fillStyle = "#f00";
			world.canvasContext.fillRect(current.x*world.tileSize,current.y*world.tileSize,world.tileSize,world.tileSize)

			//remove current from openSet and adding to closedSet
			openSet.splice(openSet.indexOf(current),1);
			closedSet[current.getIndex()] = 1;

			for(let neighbour of self.findNeighbours(current)){
				//check if neighbour has already been visited
				//if not, continue
				if(closedSet[neighbour.getIndex()] === 1){
					continue;
				}
				var tempGscore = gScore[current.getIndex()] + neighbour.weight*self.heuristicCostEstimate(current, neighbour);
				if (openSet.indexOf(neighbour) === -1){
					openSet.push(neighbour);
				}
				else if(tempGscore >= gScore[neighbour]){
					continue;
				}
				//console.log("pushed"+neighbour.getIndex())

				cameFrom[neighbour.getIndex()] = current;
				gScore[neighbour.getIndex()] = tempGscore;
				fScore.push(neighbour.getIndex(), gScore[neighbour.getIndex()] + self.heuristicCostEstimate(neighbour, endTile) );
			}
		}
		return "failed to find path";
	}
	//only for elements which are arrays of length 2, and whose elements can be compared with ===
	//only one of each element is allowed
	//TODO: find a proper name
	function PriorityQueue() {
		var self = this;
		self.data = [];
		self.push = function(element, priority){
			for(let i in self.data){
				//checking if element is in self.data[]
				if(self.data[i][0][0] === element[0] && self.data[i][0][1] === element[1]){
					//remove old element, new element will be added after break
					self.data.splice(i,1);
					break;
				}
			}
			for(var i = 0; i < self.data.length && self.data[i][1] < priority;i++);
			self.data.splice(i, 0,[element, priority]);
		}

		self.pop = function(){
			if(self.data.length > 0)
				return self.data.shift()[0];
		}

		self.size = function(){
			return self.data.length;
		}
		self.contains = function(element){
			for(let datum of self.data){
				//comparing the x and y of each thing
				if(datum[0][0] === element[0] && datum[0][1] === element[1]){
					return true;
				}
			}
			return false;
		}
	}
}
