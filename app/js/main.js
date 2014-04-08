requirejs.config({
    paths: {
        "dom-ready": "js/lib/domReady",
        "bootstrap": "js/lib/bootstrap.min",
        "jquery": "js/lib/jquery-1.11.0.min",
        "moment": "js/lib/moment.min",
        "mustache": "js/lib/mustache",
        "slider": "js/lib/bootstrap-slider.min",
        "snake-game": "js/snake/snakeGame",
        "underscore": "js/lib/underscore.min",
        "util": "js/snake/util"
    },
    shim: {
        "bootstrap": ["jquery"],
        "slider": ["jquery"]
    },
    locale: "en-us"
});
