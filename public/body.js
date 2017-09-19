"use strict";

var Body = function Body(x, y, width, height, world) {
    var _this = this;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.widthInTiles = Math.floor(width / world.tileSize);
    this.heightInTiles = Math.floor(height / world.tileSize);

    this.xTile = Math.floor(this.x / world.tileSize);
    this.yTile = Math.floor(this.y / world.tileSize);

    this.rectColor = "#000";
    this.hasGravity = false;
    this.hasCollision = false;

    this.removeFromWorld = function () {
        world.removeBuffer.push(_this);
    };

    this.sprites = [];
    this.animations = {};
    this.currentSprite;

    this.setCurrentSprite = function (index) {
        _this.currentSprite = _this.sprites[index];
    };

    //index of spritesIndexList used in body.addAnimation()
    var spriteIndex = 0;

    //add new animation specifing it's name, indices of sprites stored in body.sprites[] and framerate of animation
    this.addAnimation = function (name, spritesIndexList, framerate) {
        //body.animations[<name>]() is called in each frame to update body.currentSprite, which is then rendered
        _this.animations[name] = function () {
            if (world.currentFrame % framerate === 0) {
                if (spriteIndex > spritesIndexList.length - 1) {
                    spriteIndex = 0;
                }
                _this.setCurrentSprite(spritesIndexList[spriteIndex++]);
            }
        };
    };

    this.setCurrentAnimation = function (animationName) {
        _this.currentAnimation = _this.animations[animationName];
    };

    this.addAnimation('default', [0], 30);
    this.currentAnimation = this.animations.default;
    this.speed = 1;
    this.isMoving = false;

    //TODO dont initialize for each new object
    this.pathFinder = new Pathfinder(world).findPath;
    this.path = [];

    this.resetTileWeights = function () {
        for (var i = 0; i < _this.widthInTiles; i++) {
            for (var j = 0; j < _this.heightInTiles; j++) {
                try {
                    world.tiles[[_this.xTile + i, _this.yTile + j]].weight = 1;
                } catch (e) {
                    //TODO
                    console.log(e.message);
                }
            }
        }
    };

    this.setPosition = function (x, y) {
        //resetting previous tile weights
        _this.resetTileWeights();
        _this.x = x;
        _this.y = y;
        _this.xTile = Math.floor(_this.x / world.tileSize);
        _this.yTile = Math.floor(_this.y / world.tileSize);
    };

    this.move = function (x, y) {
        if (!_this.isMoving) {
            _this.xTile = Math.floor(_this.x / world.tileSize);
            _this.yTile = Math.floor(_this.y / world.tileSize);

            //handle edge cases #puns
            if (x < 0) x = 0;
            if (y < 0) x = 0;
            if (x >= world.widthInTiles) x = world.widthInTiles - 1;
            if (y >= world.heightInTiles) y = world.heightInTiles - 1;

            _this.path = _this.pathFinder(world.tiles[[_this.xTile, _this.yTile]], world.tiles[[x, y]]);
            _this.isMoving = true;
        } else {
            if (_this.path.length <= 0) {
                _this.isMoving = false;
                return;
            }
        }

        if (world.currentFrame % _this.speed === 0) {
            var nextTile = _this.path.pop();
            if (nextTile === undefined) return;
            _this.setPosition(nextTile.x * world.tileSize, nextTile.y * world.tileSize);
        } else {
            //interpolation
            if (_this.path.length > 0) {
                if (_this.x < _this.path[_this.path.length - 1].x * world.tileSize) {
                    _this.setPosition(_this.x + world.tileSize / _this.speed, _this.y);
                } else if (_this.x > _this.path[_this.path.length - 1].x * world.tileSize) {
                    _this.setPosition(_this.x - world.tileSize / _this.speed, _this.y);
                }
                if (_this.y < _this.path[_this.path.length - 1].y * world.tileSize) {
                    _this.setPosition(_this.x, _this.y + world.tileSize / _this.speed);
                } else if (_this.y > _this.path[_this.path.length - 1].y * world.tileSize) {
                    _this.setPosition(_this.x, _this.y - world.tileSize / _this.speed);
                }
            }
        }
    };

    this.getTransform = function () {
        return {
            x: _this.xTile,
            y: _this.yTile,
            height: _this.height,
            width: _this.width
        };
    };
};