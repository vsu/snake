define(
    [
        "canvas",
        "cell-map",
        "constants",
        "food",
        "snake",
        "util",
        "underscore"
    ],
    function (Canvas, CellMap, constants, Food, Snake, util) {
       /**
        * Object constructor.
        * @param {Object}   canvas            the canvas DOM object
        * @param {Integer}  devicePixelRatio  the device pixel ratio
        */
        var SnakeGame = function (canvas, devicePixelRatio) {
            var self = this;

            // this sets the internal scaling factor between the cell map and the canvas
            var SCALE = 10;

            // the board size mapping
            var SIZE_MAP = {
                1: { rows: 30, cols: 40 },
                2: { rows: 45, cols: 60 },
                3: { rows: 60, cols: 80 }
            };

            // private variables
            var maxRow = 30;
            var maxCol = 40;
            var difficulty = 1;
            var score = 0;
            var gameSpeed = 100;
            var isPaused;
            var isStarted = false;
            var myCanvas;
            var myCellMap;
            var mySnake;
            var myFood;
            var requestId;
            var onGameOver;
            var onScoreUpdate;

            // private methods

            /**
             * Initializes the game state.
             */
            var _initGame = function() {
                myCanvas = new Canvas(maxRow, maxCol, SCALE, canvas, devicePixelRatio);
                myCellMap = new CellMap(maxRow, maxCol);
                mySnake = new Snake(myCellMap, difficulty);
                myFood = new Food(myCellMap, difficulty);
                myCellMap.addObject(myFood);

                isPaused = false;
                isStarted = false;
                score = 0;
                gameSpeed = 100;
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
             * Iterates the game state.
             */
            var _iterate = function() {
                var ret;
                ret = mySnake.move(myCellMap);
                if (ret === -1) {
                    _gameOver();
                }

                ret = _evaluate(mySnake, myFood);
                if (ret === -1) {
                    _gameOver();
                }

                myCanvas.renderCellMap(myCellMap);

                if (onScoreUpdate) {
                    onScoreUpdate(score);
                }
            }

            /**
             * Evaluates the game state.
             * @param {Object}   snake  the snake object
             * @param {Object}   food   the food object
             * @return {Integer}  -1 if the snake is killed or 0 otherwise
             */
            var _evaluate = function(snake, food) {
                if (snake.selfCollision()) {
                    return -1;
                }

                if (snake.foodEaten(food)) {
                    // grow the snake
                    snake.setGrow(4);

                    // add food score to total score
                    score += food.getScore();

                    // game speed increases faster with increasing difficulty
                    if (gameSpeed > 10) {
                        gameSpeed -= (3 * difficulty);
                    }

                    // create new food
                    myCellMap.removeObject(food, snake.getColor());
                    myFood = new Food(myCellMap, difficulty);
                    myCellMap.addObject(myFood);

                } else {
                    // food score decreases over time
                    food.decrementScore();
                }

                return 0;
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

            // public methods
            _.extend(self, {
                /*
                 * Sets game options.
                 * @param {Object}  options  the options object
                 */
                setOptions: function (options) {
                    if (_(options).has("size")) {
                        maxRow = SIZE_MAP[options.size].rows;
                        maxCol = SIZE_MAP[options.size].cols;
                    }

                    if (_(options).has("difficulty")) {
                        difficulty = options.difficulty;
                    }
                },

                /*
                 * Resets the game.
                 */
                reset: function() {
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
                 * Returns a value indicating whether the game has started.
                 * @return  {Boolean}  true if started or false otherwise
                 */
                isStarted: function () {
                    return isStarted;
                },

                /*
                 * Changes the snake direction when the UP key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyUp: function() {
                    if (!isPaused) {
                        mySnake.setDirection(constants.dir.UP, !isStarted);
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the DOWN key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyDown: function() {
                    if (!isPaused) {
                        mySnake.setDirection(constants.dir.DOWN, !isStarted);
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the LEFT key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyLeft: function() {
                    if (!isPaused) {
                        mySnake.setDirection(constants.dir.LEFT, !isStarted);
                        _iterate();
                    }
                },

                /*
                 * Changes the snake direction when the RIGHT key is pressed.
                 * Should be called in the key event handler.
                 */
                onKeyRight: function() {
                    if (!isPaused) {
                        mySnake.setDirection(constants.dir.RIGHT, !isStarted);
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

