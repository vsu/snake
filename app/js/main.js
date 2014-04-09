requirejs.config({
    paths: {
        "bootstrap": "js/lib/bootstrap.min",
        "dom-ready": "js/lib/domReady",
        "jquery": "js/lib/jquery-1.11.0.min",
        "moment": "js/lib/moment.min",
        "mustache": "js/lib/mustache",
        "slider": "js/lib/bootstrap-slider.min",
        "underscore": "js/lib/underscore.min",
        "canvas": "js/snake/canvas",
        "constants": "js/snake/constants",
        "cell-map": "js/snake/cellMap",
        "food": "js/snake/food",
        "snake": "js/snake/snake",
        "snake-game": "js/snake/snakeGame",
        "util": "js/snake/util"
    },
    shim: {
        "bootstrap": ["jquery"],
        "slider": ["jquery"]
    },
    locale: "en-us"
});
