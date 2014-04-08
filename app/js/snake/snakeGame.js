define(
    [
        "jquery",
        "underscore"
    ],
    function () {
       /**
        * Object constructor.
        */
        var SnakeGame = function (canvasId, devicePixelRatio) {
            var self = this;

            // this sets the internal scaling factor between the cell map and the canvas
            var SCALE = 10;

            // direction constants
            var LEFT = 1;
            var RIGHT = 2;
            var UP = 3;
            var DOWN = 4;

            // component color constants
            var EMPTY_COLOR = "#FFFFFF";
            var SNAKE_COLOR = "#8B4513";
            var FOOD_COLOR = "#228B22";

            // snake class
            Snake = function(r, c, dir, g) {
                this.row = r;             // row of snake head
                this.col = c;             // column of snake head
                this.dir = dir;           // starting direction of snake movement
                this.color = SNAKE_COLOR; // color of snake
                this.rowArr = [];         // array that holds the rows where snake currently resides
                this.colArr = [];         // array that holds the columns where snake currently resides
                this.grow = g;            // if positive, snake will grow until this value becomes zero
            };

            // food class
            Food = function(r, c, l, score) {
                this.row = r;            // row of food position
                this.col = c;            // column of food position
                this.len = l;            // additional length this food will give to the snake
                this.score = score;      // score added to total score when this food is eaten
                this.color = FOOD_COLOR; // color of food
            };

            // private variables
            var minRow = 1;
            var maxRow = 30;
            var minCol = 1;
            var maxCol = 40;
            var difficulty = 1;
            var mySnake;
            var myFood;
            var score = 0;
            var gameSpeed = 100;
            var isPaused;
            var isStarted = false;
            var canvas;
            var context;
            var cellMap;
            var requestId;
            var onGameOver;
            var onScoreUpdate;

            // private methods

            /**
             * Initializes the canvas.
             */
            var _initCanvas = function() {
                var pixelRatio = devicePixelRatio || 1;

                canvas = document.getElementById(canvasId);

                canvas.width = maxCol * SCALE * pixelRatio;
                canvas.height = maxRow * SCALE * pixelRatio;
                canvas.style.width = canvas.width + "px";
                canvas.style.height = canvas.height + "px";

                context = canvas.getContext("2d");

                // draw border
                _drawLine(0, 0, canvas.width, 0);
                _drawLine(canvas.width, 0, canvas.width, canvas.height);
                _drawLine(canvas.width, canvas.height, 0, canvas.height);
                _drawLine(0, canvas.height, 0, 0);
            };

            /**
             * Initializes the game state.
             */
            var _initGame = function() {
                cellMap = new Array();
                _(_.range(maxRow)).each(function (map) {
                    var row = new Array();

                    _(_.range(maxCol)).each(function (col) {
                        row.push(EMPTY_COLOR);
                    });

                    cellMap.push(row);
                });

                isPaused = false;
                isStarted = false;
                score = 0;
                gameSpeed = 100;
                mySnake = _createSnake();
                myFood = _createFood();
                _addObject(myFood);
            };

            /**
             * Starts the game.
             */
            var _start = function() {
                if (!isStarted) {
                    isStarted = true;

                    window.requestAnimationFrame =
                        window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                      window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

                    function step(timestamp) {
                        setTimeout(function () {
                            if (isStarted) {
                                if (!isPaused) {
                                    _iterate();
                                }

                                requestAnimationFrame(step);
                            }
                        }, gameSpeed);
                    }

                    requestId = requestAnimationFrame(step);
                }
            };

            /**
             * Stops the game.
             */
            var _stop = function () {
                window.cancelAnimationFrame(requestId);
                isStarted = false;
            };

            /**
             * Draws a line on the canvas.
             * @param {Integer}  startX  the starting x coordinate
             * @param {Integer}  startY  the starting y coordinate
             * @param {Integer}  endX    the ending x coordinate
             * @param {Integer}  endY    the ending y coordinate
             * @param {String}   color   the line color
             */
            var _drawLine = function (startX, startY, endX, endY, color) {
                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);

                if (color) {
                    context.strokeStyle = color;
                }

                context.stroke();
            };

            /**
             * Renders the cell map to the canvas.
             */
            var _drawCanvas = function() {
                // clear the canvas but preserve the border
                context.clearRect(1, 1, canvas.width - 2, canvas.height - 2);

                _(cellMap).each(function(row, rowIndex) {
                    _(row).each(function (cell, colIndex) {
                        if (cell != EMPTY_COLOR) {
                            x = colIndex * SCALE;
                            y = rowIndex * SCALE;

                            context.fillStyle = cell;
                            context.fillRect(x, y, SCALE, SCALE);
                        }
                    });
                });
            }

            /**
             * Iterates the game state.
             */
            var _iterate = function() {
                var ret;
                ret = _move(mySnake);
                if (ret === -1) {
                    _gameOver();
                }

                ret = _evaluate(mySnake, myFood);
                if (ret === -1) {
                    _gameOver();
                }

                _drawCanvas();

                if (onScoreUpdate) {
                    onScoreUpdate(score);
                }
            }

            /**
             * Moves the snake.
             * @param {Object}   snake  the snake object
             * @return {Integer}  -1 if the snake is killed or 0 otherwise
             */
            var _move = function(snake) {
                switch (snake.dir) {
                    case UP:
                        if (snake.row > minRow) {
                            snake.row--;
                        } else {
                            return -1; // collided with left wall
                        }
                        break;

                    case DOWN:
                        if (snake.row < maxRow) {
                            snake.row++;
                        } else {
                            return -1; // collided with right wall
                        }
                        break;

                    case LEFT:
                        if (snake.col > minCol) {
                            snake.col--;
                        } else {
                            return -1; // collided with top wall
                        }
                        break;

                    case RIGHT:
                        if (snake.col < maxCol) {
                            snake.col++;
                        } else {
                            return -1; // collided with bottom wall
                        }
                        break;
                }

                if (snake.grow === 0) { // if snake is not growing, reset the tail cell to empty
                    var rowEnd = snake.rowArr.shift();
                    var colEnd = snake.colArr.shift();
                    _colorCell(rowEnd, colEnd, EMPTY_COLOR);
                } else {
                    snake.grow--;
                }

                _colorCell(snake.row, snake.col, snake.color);
                snake.rowArr.push(snake.row);
                snake.colArr.push(snake.col);

                return 0;
            };

            /**
             * Evaluates the game state.
             * @param {Object}   snake  the snake object
             * @param {Object}   food   the food object
             * @return {Integer}  -1 if the snake is killed or 0 otherwise
             */
            var _evaluate = function(snake, food) {
                if (_selfCollision(snake)) {
                    return -1;
                }

                if ((snake.row === food.row) && (snake.col === food.col)) { // food eaten
                    snake.grow = 4;

                    score += food.score;

                    // game speed increases faster with increasing difficulty
                    if (gameSpeed > 10) {
                        gameSpeed -= (3 * difficulty);
                    }

                    _removeObject(food, snake.color);
                    myFood = _createFood();
                    _addObject(myFood);

                } else if (food.score > 1) {
                    // food score decreases over time
                    food.score--;
                }

                return 0;
            };

            /*
            * Checks if the snake has collided with itself.
            * @param {Object}  snake  the snake object
            * @return {Boolean}  true if collision or false otherwise
            */
            var _selfCollision = function(snake) {
                var i;
                var len = snake.rowArr.length - 1; // skip last element which contains the current position
                for (i = 0; i < len; i++) {
                    if (snake.row === snake.rowArr[i] && snake.col === snake.colArr[i]) {  // collided with self
                        return true;
                    }
                }

                return false;
            };

            /**
             * Generates a random number based on difficulty level.
             * As difficulty increases, the range approaches [0,1), so that food can occur
             * near the board walls.
             * @return {Object}  a new snake object
             */
            var _getRandom = function(difficulty) {
                switch (difficulty) {
                    case 1:
                        return (Math.random() + 1) / 3;

                    case 2:
                        return (2 * Math.random() + 1) / 4;

                    case 3:
                        return Math.random();
                }

                return 0;
            }

            /**
             * Creates a new snake object.
             * @return {Object}  a new snake object
             */
            var _createSnake = function() {
                var row;
                var col;

                while (true) {
                    row = Math.floor(_getRandom(difficulty) * maxRow) + 1;
                    col = Math.floor(_getRandom(difficulty) * maxCol) + 1;

                    if (_isEmptyCell(row, col)) {
                        var dir = RIGHT;
                        var margin = 5;

                        // set the initial direction away from the wall if the snake location
                        // is within a given margin of the wall
                        if (row > (maxRow - margin)) {
                            dir = UP;
                        } else if (row < (minRow + margin)) {
                            dir = DOWN;
                        } else if (col > (maxCol - margin)) {
                            dir = LEFT;
                        } else if (col < (minCol + margin)) {
                            dir = RIGHT;
                        }

                        return new Snake(row, col, dir, 4);
                    }
                }
            };

            /**
             * Creates a new food object.
             * @return {Object}  a new food object
             */
            var _createFood = function() {
                var row;
                var col;
                var len = 5;
                var score = 250;

                while (true) {
                    row = Math.floor(_getRandom(difficulty) * maxRow) + 1;
                    col = Math.floor(_getRandom(difficulty) * maxCol) + 1;

                    if (_isEmptyCell(row, col)) {
                        return new Food(row, col, len, score);
                    }
                }
            };

            /**
             * Adds an object to the cell map.
             * @param {Object}  o  object to add
             */
            var _addObject = function(o) {
                cellMap[o.row - 1][o.col - 1] = o.color;
            };

            /*
            * Removes an object from the cell map.
            * @param {Object}  o      object to remove
            * @param {String}  color  color to set the cell to
            */
            var _removeObject = function(o, color) {
                _colorCell(o.row, o.col, color);
            };

            /*
            * Checks if a given cell is unoccupied in the cell map.
            * @param {Integer}  row  the cell row to check
            * @param {Integer}  col  the cell column to check
            * @return {Boolean}  true if empty or false otherwise
            */
            var _isEmptyCell = function(row, col) {
                return cellMap[row - 1][col - 1] == EMPTY_COLOR;
            };

            /*
            * Sets the color of a given cell.
            * @param {Integer}  row    the cell row to check
            * @param {Integer}  col    the cell column to check
            * @param {String}   color  color to set the cell to
            */
            var _colorCell = function(row, col, color) {
                cellMap[row - 1][col - 1] = color;
            };

            /**
             * Executed when the game ends.
             */
            var _gameOver = function() {
                _stop();

                if (onGameOver) {
                    onGameOver();
                }
            };


            _.extend(self, {
                // public methods

                /*
                 * Sets game options.
                 * @param {Object}  options  the options object
                 */
                setOptions: function (options) {
                    if (_(options).has("size")) {
                        switch (options.size) {
                            case 1:
                                maxRow = 30;
                                maxCol = 40;
                                break;
                            case 2:
                                maxRow = 45;
                                maxCol = 60;
                                break;
                            case 3:
                                maxRow = 60;
                                maxCol = 80;
                                break;
                        }
                    }

                    if (_(options).has("difficulty")) {
                        difficulty = options.difficulty;
                    }
                },

                /*
                 * Resets the game.
                 */
                reset: function() {
                    _initCanvas();
                    _initGame();
                    _iterate();
                },

                /*
                 * Starts the game.
                 */
                start: _start,

                /*
                 * Stops the game.
                 */
                stop: _stop,

                /*
                 * Getter function to determine if game has started.
                 * @return {Boolean}  true if game has started or false otherwise
                 */
                isStarted: function() {
                    return isStarted;
                },

                /*
                 * Changes the snake direction when the UP key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyUp: function() {
                    if (isPaused) {
                        return;
                    }

                    if (mySnake.dir !== DOWN) {
                        mySnake.dir = UP;
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the DOWN key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyDown: function() {
                    if (isPaused) {
                        return;
                    }

                    if (mySnake.dir !== UP) {
                        mySnake.dir = DOWN;
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the LEFT key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyLeft: function() {
                    if (isPaused) {
                        return;
                    }

                    if (mySnake.dir !== RIGHT) {
                        mySnake.dir = LEFT;
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the RIGHT key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyRight: function() {
                    if (isPaused) {
                        return;
                    }

                    if (mySnake.dir !== LEFT) {
                        mySnake.dir = RIGHT;
                        _iterate();
                    }
                },

                /*
                 * Pauses the game when the PAUSE key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyPause: function() {
                    if (isPaused) {
                        isPaused = false;
                    } else {
                        isPaused = true;
                    }
                },

                /*
                 * Sets a handler for the game over event.  Callback function has no arguments.
                 * @param {Function}  callback  the callback function
                 */
                setGameOverHandler: function (callback) {
                    onGameOver = callback;
                },

                /*
                 * Sets a handler for the score update event.  Callback function should
                 * accept one argument, which is the score.
                 * @param {Function}  callback  the callback function
                 */
                setScoreUpdateHandler: function (callback) {
                    onScoreUpdate = callback;
                }
            });
        };

        // return the constructor
        return SnakeGame;
    }
);

