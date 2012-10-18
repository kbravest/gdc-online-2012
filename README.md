This game demo was shown as part of the "Creative solutions to the limitations of HTML5 as a game platform" presentation at the GDC Online 2012 Conference.

See it in action here: http://www.moot-point.com/demos/gdc-online-2012/index.html

The demo currently works only in Google Chrome. Although many of the features are supported on other modern browsers, most of the API calls in the demo contain webkit-specific prefixes which will prevent them from working properly on browsers other than Chrome. As of Chrome 22, all features will work out of box with the vanilla browser settings except for Pointer Lock. To enable pointer lock, go to chrome://flags and set the "Pointer Lock" option to "Enabled".

Please see the following scripts for implementations of each feature:

    Gamepad API
        /input/gamepad-input.js

    GetUserMedia API (Webcam)
        /gameobjects/webcam.js
    
    Fullscreen API
        /stage.js

    Pointer Lock API
        /stage.js

    Three.js
        /game.js::loadGeometries()

    WebAudio API
        /lib/audio-manager.js
        /game.js::loadAudio()