/**
 * @fileOverview
 * Webcam Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib/util',
        'lib/events'
    ], function(
        Util,
        Events
    ) {
    
    "use strict";
    
    /**
     * Width of buffer canvas on which to save video frame image
     * @private
     * @type {number}
     */
    var WEBCAM_CANVAS_WIDTH = 128;
    
    /**
     * Height of buffer canvas on which to save video frame image
     * @private
     * @type {number}
     */
    var WEBCAM_CANVAS_HEIGHT = 128;
    
    /**
     * Millisecond interval at which to take video frame snapshots. (smaller number for smoother animation)
     * @private
     * @type {number}
     */
    var MILLISECONDS_PER_FRAME = 100;
    
    /**
     * Webcam class used for managing webcam input.
     *
     * @class Webcam
     * @constructs
     * @param faceForeImage {AudioContext} 
     * @param videoElement {binary} Video element which will accept the webcam video stream
     * @param canvasElement {binary} Canvas element, used to grab individual frames from video element
     */
    var Webcam = function(faceForeImage, videoElement, canvasElement) {
        this.faceForeImage = faceForeImage;
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.canvasElement.width = WEBCAM_CANVAS_WIDTH;
        this.canvasElement.height = WEBCAM_CANVAS_HEIGHT;
        this.canvasContext = canvasElement.getContext('2d');
        
        this.elapsed = 0;
        this.isDirty = false;
    }

    Webcam.prototype.bindEvents = function() {
        $('#webcam .on').on('click', this.getVideoStream.bind(this));
        $('#webcam .off').on('click', this.removeVideoStream.bind(this));  
    }
     
    Webcam.prototype.unbindEvents = function() {
    }
     
    Webcam.prototype.removeVideoStream = function() {
        $('#webcam a').removeClass('active');
        $('#webcam .off').addClass('active');       
        
        this.videoElement.paused = true;
        this.videoElement.src = '';
        
        // trigger an event to let game objects know that we no longer have the video stream
        Events.trigger('disablevideo');
    }
    
    /**
     * Request the user's webcam video stream by using the GetUserMedia API
     */
    Webcam.prototype.getVideoStream = function() {
        try {
            navigator.webkitGetUserMedia(
                {video: true}, 
                this.onUserMediaSuccess.bind(this),
                this.onUserMediaError.bind(this)
            );
        } catch (e) {
            Util.log("getUserMedia failed with exception: " + e.message + " (Is the MediaStream flag enabled in about:flags?)");
        }
    }
    
    /**
     * Called upon successful acquisition of user's webcam video stream
     */
    Webcam.prototype.onUserMediaSuccess = function(stream) {
        $('#webcam a').removeClass('active');
        $('#webcam .on').addClass('active');     
        
        // Create a URL by which we will access the video stream
        var url = webkitURL.createObjectURL(stream);
        
        // Set the source of the video element and play
        this.videoElement.src = url;
        this.videoElement.play();
        
        // Trigger an event to let game objects know that we've got the video stream
        Events.trigger('enablevideo');
    }
    
    /**
     * Called upon error in scquisition of user's webcam video stream
     */
    Webcam.prototype.onUserMediaError = function(error) {
        Util.log("Failed to get access to local media. Error code was " + error.code);
    }
    
    /**
     * Called upon every frame of game update loop
     *
     * Here we throttle the rate at which frames are copied from the video stream to the canvas, to achieve better performance
     * 
     * @param elapsed {number} elapsed number of milliseconds since last frame
     */
    Webcam.prototype.update = function(elapsed) {
        if (!this.videoElement.paused && !this.videoElement.ended) {
            this.elapsed = this.elapsed + elapsed;
            
            // As long as the video is playing, mark frame as dirty
            if (this.elapsed > MILLISECONDS_PER_FRAME) {
                this.elapsed = 0;
                Events.trigger('updatevideo');
                this.isDirty = true;
            }
        }
    }
    
    /**
     * Called upon every frame of game render loop
     *
     * Note: WebGL expects a power of 2-sized texture. 
     * Therefore, we cannot use the raw video stream as a texture. since the user's webcam will likely be of at an unknown resolution.
     * To get around this, we copy individual frames from the video stream and render it to our buffer 128 x 128 canvas, which works perfectly as a texture.
     */
    Webcam.prototype.render = function() {
        this.canvasContext.drawImage(this.videoElement, 0, 0, WEBCAM_CANVAS_WIDTH, WEBCAM_CANVAS_HEIGHT);
        this.canvasContext.drawImage(this.faceForeImage, 0, 0, WEBCAM_CANVAS_WIDTH, WEBCAM_CANVAS_HEIGHT); //draws a "frame" image on top of the webcam video
        this.isDirty = false;
    }
        
    return Webcam;
});

