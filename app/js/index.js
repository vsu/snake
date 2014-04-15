require(
    [
        "dom-ready",
        "snake-game",
        "util",
        "moment",
        "mustache",
        "bootstrap",
        "slider",
        "underscore"
    ],
    function (domReady, SnakeGame, util, moment, mustache) {
        var snakeGame;
        var sliderDiff;
        var sliderSize;
        var diffMap = { 1: "Easy ", 2: "Medium", 3: "Hard" };
        var sizeMap = { 1: "Small ", 2: "Medium", 3: "Large" };

        function _showModal(title, body, posLabel, negLabel, posHandler, negHandler) {
            $(".modal-title").html(title);
            $(".modal-body").html(body);

            if (posLabel) {
                $(".btn-positive").html(posLabel);
                $(".btn-positive").show();
            } else {
                $(".btn-positive").hide();
            }

            if (negLabel) {
                $(".btn-negative").html(negLabel);
                $(".btn-negative").show();
            } else {
                $(".btn-negative").hide();
            }

            $(".btn-positive").unbind("click");
            if (posHandler) {
                $(".btn-positive").on("click", posHandler);
            }

            $(".btn-negative").unbind("click");
            if (negHandler) {
                $(".btn-negative").on("click", negHandler);
            }

            $("#modal").modal();
        }

        function _startGame() {
            if (!snakeGame.isStarted()) {
                $("#btnStart").hide();
                $("#btnPause").show();
                snakeGame.start();
            }
        }

        function _stopGame() {
            $("#btnStart").show();
            $("#btnPause").hide();
            snakeGame.stop();
        }

        function _newGame() {
            _stopGame();
            $("#btnStart").show();
            snakeGame.setOptions({ difficulty: sliderDiff.getValue(), size: sliderSize.getValue() });
            snakeGame.reset();
        }

        function _saveOptions() {
            var options = {
                difficulty: sliderDiff.getValue(),
                size: sliderSize.getValue()
            };

            util.storage.put("snake.options", options);
        }

        function _loadOptions() {
            var options = util.storage.get("snake.options");
            if (options != null) {
                sliderDiff.setValue(options.difficulty);
                sliderSize.setValue(options.size);
            }
        }

        function _saveHighScores(score) {
            var scores = util.storage.get("snake.scores");
            if (scores == null) {
                scores = [];
            }

            scores.push({ date: new Date().getTime(), score: score});

            var topScores = _.chain(scores)
                .sortBy(function (item) { return -item.score; }).first(5).value();

            util.storage.put("snake.scores", topScores);
        }

        function _loadHighScores() {
            var scores = util.storage.get("snake.scores");
            if (scores != null) {
                var displayScores = _(scores).map(function (item) {
                    item["dateText"] = moment(item.date).format("llll");
                    return item;
                });

                $("#sectionScores").html(
                    mustache.render(
                        '<table class="table table-condensed">' +
                        '<tr><th>Date</th><th>Score</th>' +
                        '{{#data}}<tr><td>{{dateText}}</td><td>{{score}}</td></tr>{{/data}}' +
                        '</table>',
                        { data: displayScores }));
            } else {
                $("#sectionScores").html("<div>No high scores.</div>")
            }
        }

        domReady(function () {
            snakeGame = new SnakeGame(document.getElementById("canvas"), window.devicePixelRatio);

            sliderDiff = $("#sliderDiff").slider({
                formater: function(value) {
                    return diffMap[value];
                }
            }).data("slider");

            sliderSize = $("#sliderSize").slider({
                formater: function(value) {
                    return sizeMap[value];
                }
            }).data("slider");

            $("#btnStart").on("click", function () {
                _startGame();
            });

            $("#btnPause").on("click", function () {
                snakeGame.onKeyPause();
            });

            $("#btnNew").on("click", function () {
                _newGame();
            });

            $("#btnFullScreen").on("click", function () {
                util.fullScreen.launch(document.getElementById("canvas"));
            });

            $("#btnOptions").on("click", function () {
                if ($("#sectionOptions").is(":visible")) {
                    $("#sectionOptions").hide();
                    $(this).removeClass("glyphicon-chevron-up");
                    $(this).addClass("glyphicon-chevron-down");

                    _saveOptions();
                    _newGame();
                } else {
                    $(this).removeClass("glyphicon-chevron-down");
                    $(this).addClass("glyphicon-chevron-up");

                    _loadHighScores();

                    $("#sectionOptions").fadeIn("slow");
                }
            });

            $("#btnClearScores").on("click", function () {
                localStorage.removeItem("snake.scores");
                _loadHighScores();
            });

            $(document).on("keydown", function (event) {
                if (!$("#modal").is(":visible")) {
                    switch (event.which) {
                        case 37:
                            snakeGame.onKeyLeft();
                            _startGame();
                            break;

                        case 38:
                            snakeGame.onKeyUp();
                            _startGame();
                            break;

                        case 39:
                            snakeGame.onKeyRight();
                            _startGame();
                            break;

                        case 40:
                            snakeGame.onKeyDown();
                            _startGame();
                            break;

                        case 32:
                            snakeGame.onKeyPause();
                            break;
                    }
                }
            });

            document.getElementById("canvas").addEventListener("click", function () {
                if (!$("#sectionOptions").is(":visible")) {
                    _stopGame();
                    _showModal(
                        "New Game",
                        "Are you sure you want to start a new game?",
                        "OK",
                        "Cancel",
                        function () {
                            _newGame();
                            $("#modal").modal('hide');
                        }
                    );
                }
            }, false);

            snakeGame.setGameOverHandler(function () {
                _stopGame();

                _showModal(
                    "Game Over",
                    "The game has ended.",
                    "OK",
                    null,
                    function () {
                        var score = parseInt($("#labelScore").html());
                        if (score > 0) {
                            _saveHighScores(score);
                        }

                        _newGame();
                        $("#modal").modal('hide');
                    }
                );
            });

            snakeGame.setScoreUpdateHandler(function (score) {
                $("#labelScore").html(score);
            });

            _loadOptions();
            _newGame();
        });
    }
);
