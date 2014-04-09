define(
    [
        "constants",
        "underscore"
    ],
    function (constants) {
       /**
        * Object constructor.
        * @param {Integer}  rows  the number of rows
        * @param {Integer}  cols  the number of columns
        */
        var CellMap = function (rows, cols) {
            var self = this;

            // private methods
            var _colorCell = function(row, col, color) {
                _cellMap[row - 1][col - 1] = color;
            };

            // creates a new cell allocation map
            var _cellMap = new Array();
            _(_.range(rows)).each(function (map) {
                var row = new Array();

                _(_.range(cols)).each(function (col) {
                    row.push(constants.color.EMPTY);
                });

                _cellMap.push(row);
            });

            // public methods
            _.extend(self, {
                /**
                 * Returns this instance of the cell map.
                 * @return {Array}  The cell allocation map
                 */
                getInstance: function () {
                    return _cellMap;
                },

                /**
                 * Returns the size of the cell map.
                 * @return {Object}  A map containing the size
                 */
                size: function () {
                    return { rows: _cellMap.length, cols: _cellMap[0].length};
                },

                /**
                 * Adds an object to the cell map.
                 * @param {Object}  o  object to add
                 */
                addObject: function(o) {
                    _cellMap[o.getRow() - 1][o.getCol() - 1] = o.getColor();
                },

                /*
                 * Removes an object from the cell map.
                 * @param {Object}  o      object to remove
                 * @param {String}  color  color to set the cell to
                 */
                removeObject: function(o, color) {
                    _colorCell(o.getRow(), o.getCol(), color);
                },

                /*
                 * Checks if a given cell is unoccupied in the cell map.
                 * @param {Integer}  row    the cell row to check
                 * @param {Integer}  col    the cell column to check
                 * @return {Boolean}  true if empty or false otherwise
                 */
                isEmptyCell: function(row, col) {
                    return _cellMap[row - 1][col - 1] === constants.color.EMPTY;
                },

                /*
                 * Sets the color of a given cell.
                 * @param {Integer}  row    the cell row to check
                 * @param {Integer}  col    the cell column to check
                 * @param {String}   color  color to set the cell to
                 */
                colorCell: _colorCell
            });
        };

        // return the constructor
        return CellMap;
    }
);
