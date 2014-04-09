define(
    [
        "constants",
        "underscore"
    ],
    function (constants) {
        var _isStorageSupported = function() {
            try {
                return "localStorage" in window && window["localStorage"] !== null;
            } catch (e) {
                return false;
            }
        };

        return {
            fullScreen: {
                /*
                 * Launch full screen on the specified element.
                 * @param {Object}  element  the element to show full screen
                 */
                launch: function(element) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if(element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if(element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if(element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                },

                /*
                 * Exit full screen mode.
                 */
                exit: function() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            },

            storage: {
                /*
                 * Checks if local storage is supported by the browser.
                 * @return {Boolean}  true if supported or false otherwise
                 */
                isSupported: _isStorageSupported,

                /*
                 * Puts an object in local storage.
                 * @param {String}  key  the key to associate the object with
                 * @param {Object}  val  the object to store
                 * @return {Boolean}  true if successful or false otherwise
                 */
                put: function(key, val) {
                    if (_isStorageSupported()) {
                        localStorage[key] = JSON.stringify(val);
                        return true;
                    }

                    return false;
                },

                /*
                 * Retrieves an object from local storage.
                 * @param {String}  key  the key to associate the object with
                 * @return {Object}  the object or null if error or not found
                 */
                get: function(key) {
                    if (_isStorageSupported()) {
                        if (_(localStorage).has(key)) {
                            return JSON.parse(localStorage[key]);
                        }
                    }

                    return null;
                }
            },

            math: {
                /**
                 * Generates a random number based on difficulty level.
                 * As difficulty increases, the range approaches [0,1), so that food can occur
                 * near the board walls.
                 * @return {Object}  a new snake object
                 */
                getRandom: function(difficulty) {
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
            }

        };
    }
);
