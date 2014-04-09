define(
    [
        "constants",
        "underscore"
    ],
    function (constants) {
       /**
        * Object constructor.
        * @param {String}   canvasId          the DOM ID of the canvas
        * @param {Integer}  devicePixelRatio  the device pixel ratio
        */
        var Canvas = function (rows, cols, scale, canvasId, devicePixelRatio) {
            var self = this;

            // private variables
            var _canvas;
            var _context;
            var _scale = scale;

            // private methods
            var _drawLine = function (startX, startY, endX, endY, color) {
                _context.beginPath();
                _context.moveTo(startX, startY);
                _context.lineTo(endX, endY);

                if (color) {
                    _context.strokeStyle = color;
                }

                _context.stroke();
            };

            // creates a new canvas
            var pixelRatio = devicePixelRatio || 1;

            _canvas = document.getElementById(canvasId);

            _canvas.width = cols * _scale * pixelRatio;
            _canvas.height = rows * _scale * pixelRatio;
            _canvas.style.width = _canvas.width + "px";
            _canvas.style.height = _canvas.height + "px";

            _context = canvas.getContext("2d");

            // draw border
            _drawLine(0, 0, _canvas.width, 0);
            _drawLine(_canvas.width, 0, _canvas.width, _canvas.height);
            _drawLine(_canvas.width, _canvas.height, 0, _canvas.height);
            _drawLine(0, _canvas.height, 0, 0);

            // public methods
            _.extend(self, {
                /**
                 * Draws a line on the canvas.
                 * @param {Integer}  startX  the starting x coordinate
                 * @param {Integer}  startY  the starting y coordinate
                 * @param {Integer}  endX    the ending x coordinate
                 * @param {Integer}  endY    the ending y coordinate
                 * @param {String}   color   the line color
                 */
                drawLine: _drawLine,

                /**
                 * Renders the cell map to the canvas.
                 * @param {Array}  cellMap  the cell allocation map
                 */
                renderCellMap: function(cellMap) {
                    // clear the canvas but preserve the border
                    _context.clearRect(1, 1, _canvas.width - 2, _canvas.height - 2);

                    _(cellMap.getInstance()).each(function(row, rowIndex) {
                        _(row).each(function (cell, colIndex) {
                            if (cell != constants.color.EMPTY) {
                                x = colIndex * _scale;
                                y = rowIndex * _scale;

                                _context.fillStyle = cell;
                                _context.fillRect(x, y, _scale, _scale);
                            }
                        });
                    });
                }
            });
        };

        // return the constructor
        return Canvas;
    }
);
