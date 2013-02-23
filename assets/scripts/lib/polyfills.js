/**
 * @fileOverview
 * Pollyfills Class File
 *
 * Static class for misc polyfill functions.
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

/**
*	Bind.js
*	Copyright 2010, WebReflection
*	License: http://www.opensource.org/licenses/mit-license.php
*/
if (Function.prototype.bind === null || Function.prototype.bind === undefined) {
    Function.prototype.bind = (function (slice) {
        // (C) WebReflection - Mit Style License
        function bind(context) {
            var self = this; // "trapped" function reference
            // only if there is more than an argument
            // we are interested into more complex operations
            // this will speed up common bind creation
            // avoiding useless slices over arguments
            if (1 < arguments.length) {
                // extra arguments to send by default
                var $arguments = slice.call(arguments, 1);
                return function () {
                    return self.apply(
                        context,
                    // thanks @kangax for this suggestion
                        arguments.length ?
                    // concat arguments with those received
                            $arguments.concat(slice.call(arguments)) :
                    // send just arguments, no concat, no slice
                            $arguments
                    );
                };
            }
            // optimized callback
            return function () {
                // speed up when function is called without arguments
                return arguments.length ? self.apply(context, arguments) : self.call(context);
            };
        }

        // the named function
        return bind;

    } (Array.prototype.slice));
}

// performance.now polyfill
window.performance = window.performance || {};
performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() { return new Date().getTime(); };
})();

/**
*   requestAnimationFrame shim 
*   from http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
*/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();

            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(
                function() { callback(currTime + timeToCall); },
                timeToCall
            );
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())