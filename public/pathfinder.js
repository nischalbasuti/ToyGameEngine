"use strict";

function Pathfinder(world) {
    var _this = this;

    var INFINITY = 1000000000;
    this.INFINITY = INFINITY;

    function reconstructPath(cameFrom, current) {
        var totalPath = [];
        totalPath.push(current);
        world.canvasContext.lineWidth = world.tileSize;
        world.canvasContext.fillStyle = "#00f";
        for (var i in cameFrom) {
            try {
                //TODO: find out how why undefined is coming
                if (cameFrom[current.getIndex()] === undefined) {
                    continue;
                }
                current = cameFrom[current.getIndex()];
                totalPath.push(current);
            } catch (e) {
                console.log("ERROR: " + e.message + "\n for index: " + i);
            }
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = totalPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _current = _step.value;

                world.canvasContext.fillRect(_current.x * world.tileSize, _current.y * world.tileSize, world.tileSize, world.tileSize);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return totalPath;
    }
    function getMinFscore(openSet, fScore) {
        //console.log("poped:"+fScore.data[0][0]);
        do {
            var lowest = fScore.pop();
            var index = openSet.indexOf(world.tiles[lowest]);
        } while (index === -1);

        return {
            'value': lowest,
            'index': index
        };
    }
    this.heuristicCostEstimate = function (startTile, endTile) {
        //euclidian distance
        return Math.sqrt(Math.pow(startTile.x - endTile.x, 2) + Math.pow(startTile.y - endTile.y, 2));
        //diagonal distance
        return Math.max(Math.abs(startTile.x - endTile.x), Math.abs(startTile.y - endTile.y));
        //manhattan distance
        return Math.abs(startTile.x - endTile.x) + Math.abs(startTile.y - endTile.y);
    };

    this.findNeighbours = function (tile) {
        var neighbours = [];
        if (tile.x - 1 >= 0) {
            var node = world.tiles[[tile.x - 1, tile.y]];
            neighbours.push(node);
        }
        if (tile.x + 1 < world.widthInTiles) {
            var node = world.tiles[[tile.x + 1, tile.y]];
            neighbours.push(node);
        }
        if (tile.y - 1 >= 0) {
            var node = world.tiles[[tile.x, tile.y - 1]];
            neighbours.push(node);
        }
        if (tile.y + 1 < world.heightInTiles) {
            var node = world.tiles[[tile.x, tile.y + 1]];
            neighbours.push(node);
        }

        if (tile.x - 1 >= 0 && tile.y - 1 >= 0) {
            var node = world.tiles[[tile.x - 1, tile.y - 1]];
            neighbours.push(node);
        }
        if (tile.x + 1 < world.widthInTiles && tile.y + 1 < world.heightInTiles) {
            var node = world.tiles[[tile.x + 1, tile.y + 1]];
            neighbours.push(node);
        }
        if (tile.x - 1 >= 0 && tile.y + 1 < world.heightInTiles) {
            var node = world.tiles[[tile.x - 1, tile.y + 1]];
            neighbours.push(node);
        }
        if (tile.x + 1 < world.widthInTiles && tile.y - 1 >= 0) {
            var node = world.tiles[[tile.x + 1, tile.y - 1]];
            neighbours.push(node);
        }
        return neighbours;
    };

    this.findPath = function (startTile, endTile) {
        var closedSet = [];
        var openSet = [];
        openSet.push(startTile);
        var cameFrom = [];

        var gScore = [];
        var fScore = new PriorityQueue();
        for (var i in world.tiles) {
            gScore[i] = INFINITY;
        }
        gScore[startTile.getIndex()] = 0;
        fScore.push(startTile.getIndex(), _this.heuristicCostEstimate(startTile, endTile));

        while (openSet.length > 0) {
            var current = openSet[getMinFscore(openSet, fScore).index];

            if (current === endTile) {
                return reconstructPath(cameFrom, current);
            }

            world.canvasContext.lineWidth = world.tileSize;
            world.canvasContext.fillStyle = "#f00";
            world.canvasContext.fillRect(current.x * world.tileSize, current.y * world.tileSize, world.tileSize, world.tileSize);

            //remove current from openSet and adding to closedSet
            openSet.splice(openSet.indexOf(current), 1);
            closedSet[current.getIndex()] = 1;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this.findNeighbours(current)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var neighbour = _step2.value;

                    //check if neighbour has already been visited
                    //if not, continue
                    if (closedSet[neighbour.getIndex()] === 1) {
                        continue;
                    }
                    var tempGscore = gScore[current.getIndex()] + neighbour.weight * _this.heuristicCostEstimate(current, neighbour);
                    if (openSet.indexOf(neighbour) === -1) {
                        openSet.push(neighbour);
                    } else if (tempGscore >= gScore[neighbour]) {
                        continue;
                    }
                    //console.log("pushed"+neighbour.getIndex())

                    cameFrom[neighbour.getIndex()] = current;
                    gScore[neighbour.getIndex()] = tempGscore;
                    fScore.push(neighbour.getIndex(), gScore[neighbour.getIndex()] + _this.heuristicCostEstimate(neighbour, endTile));
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
        return "failed to find path";
    };
    //only for elements which are arrays of length 2, and whose elements can be compared with ===
    //only one of each element is allowed
    //TODO: find a proper name
    function PriorityQueue() {
        var _this2 = this;

        this.data = [];
        this.push = function (element, priority) {
            for (var _i in _this2.data) {
                //checking if element is in this.data[]
                if (_this2.data[_i][0][0] === element[0] && _this2.data[_i][0][1] === element[1]) {
                    //remove old element, new element will be added after break
                    _this2.data.splice(_i, 1);
                    break;
                }
            }
            for (var i = 0; i < _this2.data.length && _this2.data[i][1] < priority; i++) {}
            _this2.data.splice(i, 0, [element, priority]);
        };

        this.pop = function () {
            if (this.data.length > 0) return this.data.shift()[0];
        };

        this.size = function () {
            return _this2.data.length;
        };
        this.contains = function (element) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = _this2.data[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var datum = _step3.value;

                    //comparing the x and y of each thing
                    if (datum[0][0] === element[0] && datum[0][1] === element[1]) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return false;
        };
    }
}