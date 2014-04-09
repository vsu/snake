var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
          tests.push(file);
        }
      }
}

requirejs.config({
    // Karma serves files from "/base"
    baseUrl: "/base/app",

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
        "slider": ["jquery"],
        "underscore": {
            exports: "_"
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
