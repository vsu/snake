define(
    [
        "constants",
        "util",
        "underscore"
    ],
    function (constants, util) {
       /**
        * Object constructor.
        * @param {Object}   cellMap     the cell allocation map
        * @param {Integer}  difficulty  the difficulty level
        */
        var Snake = function (cellMap, difficulty) {
            var self = this;

            // private variables
            var _row;          // row of snake head
            var _col;          // column of snake head
            var _dir;          // direction of snake movement
            var _rowArr = [];  // array that holds the rows where snake currently resides
            var _colArr = [];  // array that holds the columns where snake currently resides
            var _grow = 4;     // if positive, snake will grow until this value becomes zero
            var _color = constants.color.SNAKE;

            var _minRow = 1;
            var _minCol = 1;
            var _size = cellMap.size();
            var _maxRow = _size.rows;
            var _maxCol = _size.cols;

            // create new snake
            while (true) {
                _row = Math.floor(util.math.getRandom(difficulty) * _maxRow) + 1;
                _col = Math.floor(util.math.getRandom(difficulty) * _maxCol) + 1;

                if (cellMap.isEmptyCell(_row, _col)) {
                    _dir = constants.dir.RIGHT;
                    var margin = 5;

                    // set the initial direction away from the wall if the snake location
                    // is within a given margin of the wall
                    if (_row > (_maxRow - margin)) {
                        _dir = constants.dir.UP;
                    } else if (_row < (_minRow + margin)) {
                        _dir = constants.dir.DOWN;
                    } else if (_col > (_maxCol - margin)) {
                        _dir = constants.dir.LEFT;
                    } else if (_col < (_minCol + margin)) {
                        _dir = constants.dir.RIGHT;
                    }

                    break;
                }
            }

            // public methods
            _.extend(self, {
                getRow: function() {
                    return _row;
                },

                getCol: function() {
                    return _col;
                },

                getColor: function() {
                    return _color;
                },

                setGrow: function(grow) {
                    _grow = grow;
                },

                /*
                 * Sets the direction of the snake.
                 * @param {Integer}  one of the direction constants
                 * @param {Boolean}  optional argument to skip "backtrack" check
                 */
                setDirection: function(dir, force) {
                    switch (dir) {
                        case constants.dir.UP:
                            if ((_dir !== constants.dir.DOWN) || force) {
                                _dir = dir;
                            }
                            break;

                        case constants.dir.DOWN:
                            if ((_dir !== constants.dir.UP) || force) {
                                _dir = dir;
                            }
                            break;

                        case constants.dir.LEFT:
                            if ((_dir !== constants.dir.RIGHT) || force) {
                                _dir = dir;
                            }
                            break;

                        case constants.dir.RIGHT:
                            if ((_dir !== constants.dir.LEFT) || force) {
                                _dir = dir;
                            }
                            break;
                    }
                },

                /*
                 * Determines if the snake has collided with itself.
                 * @return {Boolean}  true if collision or false otherwise
                 */
                selfCollision: function() {
                    var i;
                    var len = _rowArr.length - 1; // skip last element which contains the current position
                    for (i = 0; i < len; i++) {
                        if (_row === _rowArr[i] && _col === _colArr[i]) {  // collided with self
                            return true;
                        }
                    }

                    return false;
                },

                /*
                 * Determines if the snake has eaten food.
                 * @param {Object}  food   the food object
                 * @return {Boolean}  true if food eaten or false otherwise
                 */
                foodEaten: function(food) {
                    return ((_row === food.getRow()) && (_col === food.getCol()));
                },

                /**
                 * Moves the snake.
                 * @param {Array}  cellMap  the cell allocation map
                 * @return {Integer}  -1 if the snake is killed or 0 otherwise
                 */
                move: function(cellMap) {
                    var minRow = 1;
                    var minCol = 1;
                    var size = cellMap.size();
                    var maxRow = size.rows;
                    var maxCol = size.cols;

                    switch (_dir) {
                        case constants.dir.UP:
                            if (_row > minRow) {
                                _row--;
                            } else {
                                return -1; // collided with left wall
                            }
                            break;

                        case constants.dir.DOWN:
                            if (_row < maxRow) {
                                _row++;
                            } else {
                                return -1; // collided with right wall
                            }
                            break;

                        case constants.dir.LEFT:
                            if (_col > minCol) {
                                _col--;
                            } else {
                                return -1; // collided with top wall
                            }
                            break;

                        case constants.dir.RIGHT:
                            if (_col < maxCol) {
                                _col++;
                            } else {
                                return -1; // collided with bottom wall
                            }
                            break;
                    }

                    if (_grow === 0) { // if snake is not growing, reset the tail cell to empty
                        var rowEnd = _rowArr.shift();
                        var colEnd = _colArr.shift();
                        cellMap.colorCell(rowEnd, colEnd, constants.color.EMPTY);
                    } else {
                        _grow--;
                    }

                    cellMap.colorCell(_row, _col, _color);
                    _rowArr.push(_row);
                    _colArr.push(_col);

                    return 0;
                }
            });
        };

        // return the constructor
        return Snake;
    }
);
