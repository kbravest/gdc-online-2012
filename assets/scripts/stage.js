/**
 * @fileOverview
 * Stage Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
    ], 
    function(
    ) {

    "use strict";
    
    var Stage = function(scene, container, width, height) {
        this.scene = scene;
        this.container = container;
        var containerOffset = $(this.container).offset();
        this.x = containerOffset.left;
        this.y = containerOffset.top;   
        this.width = width;
        this.height = height;
        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.ratio = this.width / this.height;
        
        this.disableSelection(this.container); 

        $(window).on('resize', this.onResize.bind(this));
        this.fitToScreen(); 
        
        this.bindFullscreenEvents();
        this.bindPointerLockEvents();
    }
    
    /////////////////////////////////////////////////////////////////
    // Fullscreen
    /////////////////////////////////////////////////////////////////      
    
    Stage.prototype.bindFullscreenEvents = function() {
        $('#fullscreen .on').on('click', this.enterFullscreen.bind(this));
        $('#fullscreen .off').on('click', this.exitFullscreen.bind(this));

        document.addEventListener('webkitfullscreenchange', this.onFullscreenChange.bind(this), false);
        document.addEventListener('webkitfullscreenerror', this.onFullscreenError.bind(this), false);
    }     
        
    Stage.prototype.enterFullscreen = function() {
        if (this.container.webkitRequestFullScreen) {
            this.container.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        else {
            this.onFullscreenError();
        }
    }
    
    Stage.prototype.exitFullscreen = function() {
        if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else {
            this.onFullscreenError();
        }
    }
    
    Stage.prototype.isFullScreen = function() {
        return document.webkitIsFullScreen;
    }
    
    Stage.prototype.onFullscreenChange = function() {
        // Determine whether we are entering or exiting Fullscreen
        if (this.isFullScreen()) {
            this.onFullscreenEnter();
        } else {
            this.onFullscreenExit();
        }
    }

    Stage.prototype.onFullscreenEnter = function() {
        $('#fullscreen a').removeClass('active');
        $('#fullscreen .on').addClass('active');
        
        console.log('Entering Fullscreen');
    }
    
    Stage.prototype.onFullscreenExit = function() {
        $('#fullscreen a').removeClass('active');
        $('#fullscreen .off').addClass('active');   
    
        console.log('Exiting Fullscreen');
    }
    
    Stage.prototype.onFullscreenError = function() {
        alert('Error getting Fullscreen!');
    }
    
    /////////////////////////////////////////////////////////////////
    // Pointer lock
    /////////////////////////////////////////////////////////////////
    
    Stage.prototype.bindPointerLockEvents = function() {
        $('#pointerlock .on').on('click', this.enterPointerLock.bind(this));
        $('#pointerlock .off').on('click', this.exitPointerLock.bind(this));

        document.addEventListener('webkitpointerlockchange', this.onPointerLockChange.bind(this), false);
        document.addEventListener('webkitpointerlockerror', this.onPointerLockError.bind(this), false);
        
        this.fitToScreen(); 
    }    
    
    Stage.prototype.enterPointerLock = function() {
        if (this.container.webkitRequestPointerLock) {
            this.container.webkitRequestPointerLock();
        }
        else {
            this.onPointerLockError();
        }
    }
    
    Stage.prototype.exitPointerLock = function() {
        if (document.webkitExitPointerLock) {
            document.webkitExitPointerLock();
        }
        else {
            this.onPointerLockError();
        }
    }
    
    Stage.prototype.isPointerLock = function() {
        return document.webkitPointerLockElement != null;
    }    
    
    Stage.prototype.onPointerLockChange = function() {
        // Determine whether we are entering or exiting Pointer Lock
        if (this.isPointerLock()) {
            this.onPointerLockEnter();
        } else {
            this.onPointerLockExit();
        }
    }    
        
    Stage.prototype.onPointerLockEnter = function() {
        $('#pointerlock > a').removeClass('active');
        $('#pointerlock .on').addClass('active');
        console.log('Entering Pointer Lock');
    }
    
    Stage.prototype.onPointerLockExit = function() {
        $('#pointerlock > a').removeClass('active');
        $('#pointerlock .off').addClass('active');
        console.log('Exiting Pointer Lock');
    }    

    Stage.prototype.onPointerLockError = function() {
        alert('Error getting Pointer Lock!\n\nHave you set "Enable Pointer Lock" in about:flags?');
    }
    
    /////////////////////////////////////////////////////////////////
    // Resize
    /////////////////////////////////////////////////////////////////      
    
    Stage.prototype.onResize = function(e) {
        this.fitToScreen(); 
    }    
    
    Stage.prototype.fitToScreen = function() {
        // could just set to css width and height to 100%, but this results in performance issues
        // to ensure scale is hardware-accelerated, use 3d css transforms to scale up to appropriate size
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        
        // scale width as a function of height
        var targetHeight = screenHeight;
        var targetWidth = targetHeight * this.ratio;
        
        // scale height as a function of width
        if (targetWidth >= screenWidth) {
            targetWidth = screenWidth;
            targetHeight = targetWidth / this.ratio;
        }
        
        var scaleRatioWidth = targetWidth / this.width;
        var scaleRatioHeight = targetHeight / this.height;
        
        var translateX = -this.halfWidth + targetWidth / 2 + (screenWidth - targetWidth) / 2;
        var translateY = -this.halfHeight + targetHeight / 2 + (screenHeight - targetHeight) / 2;
                
        var transformation = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale3d(' + scaleRatioWidth + ', ' + scaleRatioHeight + ', 1)';
        
        $(this.container)
            .css('display', 'block')
            .css('-webkit-backface-visibility', 'hidden')
            .css('-webkit-perspective', 1000)
            .css('-webkit-transform', transformation)
            .css('-moz-transform', transformation)
            .css('-o-transform', transformation)
            .css('-ms-transform', transformation)
            .css('transform', transformation);
    }
    
    Stage.prototype.fitReset = function(e) {
        $(this.container)
            .css('-webkit-backface-visibility', '')
            .css('-webkit-perspective', '')
            .css('-webkit-transform', '')
            .css('-moz-transform', '')
            .css('-o-transform', '')
            .css('-ms-transform', '')
            .css('transform', '');
    }  
    
    /////////////////////////////////////////////////////////////////////
	// helpers
    //////////////////////////////////////////////////////////////////////
	    
    Stage.prototype.preventDefault = function(e) {
        if (e && e.preventDefault) { e.preventDefault(); }
        if (e && e.stopPropagation) { e.stopPropagation(); }
        return false;
    }  
    
     /**
     * Prevent default browser behaviors when dragging and selecting images and text
     * (eg: a different cursor appearing when dragging an image)
     * @param {Object} element jQuery element to disable selections for
     */   
    Stage.prototype.disableSelection = function(element) {
        element.ondragstart = this.preventDefault;
        element.onselectstart = this.preventDefault; //IE-specific
        $(element).addClass('noselect');
    }
    
    return Stage;   
});