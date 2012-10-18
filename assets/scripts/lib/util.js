/**
 * @fileOverview
 * Util Class File
 *
 * Static class for misc util functions.
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib-thirdparty/three'   
    ], function(
    ) {
    
    "use strict";
    
    var Util = {};
    
    Util.renderCompositeImage = function(imageArray, context, width, height) {
        for (var i=0; i < imageArray.length; i++) {
            context.drawImage(imageArray[i], 0, 0, width, height);
        }
    }
    
    Util.log = function(message) {
        console.log(message);
        alert(message);
    }

    return Util;
});