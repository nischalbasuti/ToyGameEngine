"use strict";

var WorldRenderer = function WorldRenderer(world) {
    this.renderWorld = function () {
        //clearing screen
        world.canvasContext.clearRect(0, 0, world.width, world.height);
        var tileRowCount = 0;
        var tileColCount = 0;
        world.canvasContext.lineWidth = 0.5;
        for (var i = 0; i < world.heightInTiles * world.widthInTiles; i++) {
            world.canvasContext.strokeStyle = "#828282";

            if (tileColCount >= world.widthInTiles) {
                tileRowCount++;
                tileColCount = 0;
            }
            world.canvasContext.strokeRect(tileColCount * world.tileSize, tileRowCount * world.tileSize, world.tileSize, world.tileSize);
            tileColCount++;
        }
        world.canvasContext.lineWidth = 1;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = world.bodies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var body = _step.value;

                if (world.renderRect === true) {
                    world.canvasContext.strokeStyle = body.rectColor;

                    //draw rectangles to canvas
                    world.canvasContext.strokeRect(body.x, body.y, body.width, body.height);
                    if (body.destBody != null) {
                        world.canvasContext.strokeStyle = "#00f";
                        world.canvasContext.strokeRect(body.destBody.x, body.destBody.y, body.destBody.width, body.destBody.height);
                    }
                }
                //draw sprite to canvas
                world.canvasContext.drawImage(body.currentSprite, body.x, body.y, body.width, body.height);
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
};