/**
 * @fileOverview
 * Main Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */
 
require.config({
    baseUrl: 'assets/scripts',
   urlArgs: 'cb=' + (new Date()).getTime()
});

require([
	'lib/polyfills',
	'game'
    ], function(
        Polyfills, 
        Game
    ) {
	
    "use strict"; 
    
    $(document).ready(function() {
        var game = new Game();
    });
});