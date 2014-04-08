define(
    [
        "underscore"
    ],
    function () {
        var _isStorageSupported = function() {
            try {
                return "localStorage" in window && window["localStorage"] !== null;
            } catch (e) {
                return false;
            }
        };


        return {
            /*
             * Checks if local storage is supported by the browser.
             * @return {Boolean}  true if supported or false otherwise
             */
            isStorageSupported: _isStorageSupported,

            /*
             * Puts an object in local storage.
             * @param {String}  key  the key to associate the object with
             * @param {Object}  val  the object to store
             * @return {Boolean}  true if successful or false otherwise
             */
            putStorage: function(key, val) {
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
            getStorage: function(key) {
                if (_isStorageSupported()) {
                    if (_(localStorage).has(key)) {
                        return JSON.parse(localStorage[key]);
                    }
                }

                return null;
            }

        };
    }
);
