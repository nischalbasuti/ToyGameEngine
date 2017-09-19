"use strict";

function World(canvasContext) {
    var _this = this;

    this.canvasContext = canvasContext;
    this.bodies = [];

    this.height = canvasContext.canvas.height;
    this.width = canvasContext.canvas.width;

    //push bodies to this.removeBuffer to safely remove bodies in this.update()
    this.removeBuffer = [];

    this.worldRenderer = new WorldRenderer(this);
    this.renderRect = false;

    this.tileSize = 2;

    this.addBody = function (body) {
        _this.bodies.push(body);
    };

    this.removeBody = function (body) {
        console.log('removed: ' + JSON.stringify(body));
        body.resetTileWeights();
        var index = _this.bodies.indexOf(body);
        if (index > -1) {
            _this.bodies.splice(index, 1);
        }
    };

    this.render = function () {
        _this.worldRenderer.renderWorld();
    };

    this.FPS = 30;
    this.currentFrame = 0;
    //TODO: clean up
    this.update = function (update) {
        _this.usersUpdate = update;
        _this.innerUpdate = function () {
            _this.currentFrame++;
            _this.updateTiles();
            _this.render();
            _this.usersUpdate();
            for (var i in _this.removeBuffer) {
                _this.removeBody(_this.removeBuffer[i]);
            }
            _this.removeBuffer = [];

            requestAnimationFrame(_this.innerUpdate);
        };
        requestAnimationFrame(_this.innerUpdate);
    };
    this.updateTiles = function () {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _this.bodies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var body = _step.value;

                body.currentAnimation();
                _this.tiles[[body.xTile, body.yTile]].weight = Pathfinder.INFINITY;
                for (var i = 0; i < body.widthInTiles; i++) {
                    for (var j = 0; j < body.heightInTiles; j++) {
                        try {
                            _this.tiles[[body.xTile + i, body.yTile + j]].weight = 55;
                        } catch (e) {
                            console.log(e.message + "\nthis is expected to happen if part of the body is off screen");
                        }
                    }
                }
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
    };

    this.tiles = [];
    this.setupTiles = function (tileSize, widthInTiles, heightInTiles) {
        _this.tileSize = tileSize;
        _this.widthInTiles = widthInTiles;
        _this.heightInTiles = heightInTiles;
        _this.width = _this.canvasContext.canvas.width = widthInTiles * tileSize;
        _this.height = _this.canvasContext.canvas.height = heightInTiles * tileSize;

        for (var i = 0; i < _this.widthInTiles; i++) {
            for (var j = 0; j < _this.heightInTiles; j++) {
                _this.tiles[[i, j]] = new Tile(i, j, 1);
            }
        }
    };
}