function Pathfinder(world){
	var self = this;
	var INFINITY = 1000000000;
	self.INFINITY = INFINITY;

	function reconstructPath(cameFrom, current){
		var totalPath = [];
		totalPath.push(current)
		console.log(cameFrom);
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
		var lowest = INFINITY;
		var index = undefined;
		//TODO remove loop over openset and implement with prioority queue
		for(var i in openSet){
			if(fScore[openSet[i].getIndex()] < lowest){
				lowest = fScore[openSet[i].getIndex()];
				console.log(openSet[i].getIndex())
				index = i;
			}
		}
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
		var fScore = [];
		for(var i in world.tiles) {
			gScore[i] = INFINITY; 
			fScore[i] = INFINITY; 
		}
		gScore[startTile.getIndex()] = 0;
		fScore[startTile.getIndex()] = self.heuristicCostEstimate(startTile, endTile);

		while(openSet.length > 0){
			var current = openSet[getMinFscore(openSet,fScore).index];
			console.log(openSet)
			console.log("min fscore: "+JSON.stringify(getMinFscore(openSet,fScore)));
			if(current === undefined){
				return [];
			}
			
			if (current === endTile){
				return reconstructPath(cameFrom, current);
			}
			world.canvasContext.lineWidth = world.tileSize;
			world.canvasContext.fillStyle = "#f00";
			console.log(current)
			world.canvasContext.fillRect(current.x*world.tileSize,current.y*world.tileSize,world.tileSize,world.tileSize)

			//remove current from openSet and adding to closedSet
			openSet.splice(openSet.indexOf(current),1);
			closedSet.push(current);

			for(neighbour of self.findNeighbours(current)){
				//check if neighbour has already been visited
				//if not, continue
				if(closedSet.indexOf(neighbour) > -1){
					continue;
				}
				var tempGscore = gScore[current.getIndex()] + neighbour.weight*self.heuristicCostEstimate(current, neighbour);
				if (openSet.indexOf(neighbour) === -1){
					openSet.push(neighbour);
				}
				else if(tempGscore >= gScore[neighbour]){
					continue;
				}

				cameFrom[neighbour.getIndex()] = current;
				gScore[neighbour.getIndex()] = tempGscore;
				fScore[neighbour.getIndex()] = gScore[neighbour.getIndex()] + self.heuristicCostEstimate(neighbour, endTile);
			}
		}
		console.log("failed to find path");
		return "failed to find path";
	}
}
