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
        var Food = function (cellMap, difficulty) {
            var self = this;

            // private variables
            var _row;          // row of food position
            var _col;          // column of food position
            var _len = 5;      // additional length this food will give to the snake
            var _score = 250;  // score added to total score when this food is eaten
            var _color = constants.color.FOOD;

            var _size = cellMap.size();
            var _maxRow = _size.rows;
            var _maxCol = _size.cols;

            // create new food
            while (true) {
                _row = Math.floor(util.math.getRandom(difficulty) * _maxRow) + 1;
                _col = Math.floor(util.math.getRandom(difficulty) * _maxCol) + 1;

                if (cellMap.isEmptyCell(_row, _col)) {
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

                getScore: function() {
                    return _score;
                },

                decrementScore: function() {
                    if (_score > 1) {
                        _score--;
                    }
                }
            });
        };

        // return the constructor
        return Food;
    }
);
