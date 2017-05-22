function Pathfinder(world){
	var self = this;
	var INFINITY = 100000;

	function reconstructPath(cameFrom, current){
		var totalPath = [];
		totalPath.push(current)
		console.log(cameFrom);
		world.canvasContext.lineWidth = 5;
		world.canvasContext.strokeStyle = "#00f";
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
			world.canvasContext.strokeRect(current.x*world.tileSize,current.y*world.tileSize,world.tileSize,world.tileSize)
		}
		return totalPath;
	}
	function getMinFscore(openSet, fScore){
		var lowest = INFINITY;
		var index = undefined;
		for(var i in openSet){
			if(fScore[openSet[i].getIndex()] < lowest){
				lowest = fScore[openSet[i].getIndex()];
				index = i;
			}
		}
		return {
			'value': lowest,
			'index': index
		};
	}
	self.heuristicCostEstimate = function (startTile, endTile){
		//using manhattan distance
		return Math.abs(startTile.x - endTile.x) + Math.abs(startTile.y - endTile.y);
	}

	self.findNeighbours = function(tile) {
		var neighbours = [];
		if(tile.x-1 >= 0){
			var left = world.tiles[ [tile.x-1, tile.y] ];
			neighbours.push(left);
		}
		if(tile.x+1 < world.widthInTiles){
			var right = world.tiles[ [tile.x+1, tile.y] ];
			neighbours.push(right);
		}
		if(tile.y-1 >= 0){
			var top = world.tiles[ [tile.x, tile.y-1] ];
			neighbours.push(top);
		}
		if(tile.y+1 < world.heightInTiles){
			var bottom = world.tiles[ [tile.x, tile.y+1] ];
			neighbours.push(bottom);
		}

		if(tile.x-1 >= 0 && tile.y-1 >= 0){
			neighbours.push(world.tiles[ [tile.x-1, tile.y-1] ]);
		}
		if(tile.x+1 < world.widthInTiles && tile.y+1 < world.heightInTiles){
			neighbours.push(world.tiles[ [tile.x+1, tile.y+1] ]);
		}
		if(tile.x-1 >=0 && tile.y+1 < world.heightInTiles){
			neighbours.push(world.tiles[ [tile.x-1, tile.y+1] ]);
		}
		if(tile.x+1 < world.widthInTiles && tile.y-1 >= 0){
			neighbours.push(world.tiles[ [tile.x+1, tile.y-1] ]);
		}
		return neighbours;
	}

	self.findPath = function(startTile, endTile){
		var closedSet = [];
		var openSet = [];
		openSet.push(startTile);
		var cameFrom = [];

		var graphScore = [];
		var fScore = [];
		for(var i in world.tiles) {
			graphScore[i] = (INFINITY); 
			fScore[i] = (INFINITY); 
		}
		graphScore[startTile.getIndex()] = 0;
		fScore[startTile.getIndex()] = self.heuristicCostEstimate(startTile, endTile);

		while(openSet.length > 0){
			var current = openSet[getMinFscore(openSet,fScore).index];
			if (current === endTile){
				return reconstructPath(cameFrom, current);
			}

			openSet.splice(openSet.indexOf(current),1);
			closedSet.push(current);
			for(neighbour of self.findNeighbours(current)){
				if(closedSet.indexOf(neighbour) > -1){
					continue;
				}
				var tempGscore = graphScore[current.getIndex()] + self.heuristicCostEstimate(current, neighbour);
				if (openSet.indexOf(neighbour) === -1){
					openSet.push(neighbour);
				}
				else if(tempGscore >= graphScore[neighbour]){
					continue;
				}

				cameFrom[neighbour.getIndex()] = current;
				graphScore[neighbour.getIndex()] = tempGscore;
				fScore[neighbour.getIndex()] = graphScore[neighbour.getIndex()] + self.heuristicCostEstimate(neighbour, endTile);
			}
		}
		console.log("failed to find path");
		return "failed to find path";
	}
}
