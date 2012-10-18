/**
 * @fileOverview
 * AudioManager Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */
 
define([
    ], 
    function(
    ) {
    
    "use strict";
    
    /**
     * World boundary constants for purposes of positional audio
     * @private
     * @type {number}
     */
    var WORLD_BOUNDARY_X = 500;
    var WORLD_BOUNDARY_Y = 500;
    var WORLD_BOUNDARY_Z = 500;    
    
    /**
     * Audio manager class used for managing an audio asset. 
     * A convenient way of loading a single audio asset into memory once, and later creating multiple AudioBuffer objects for purposes of playing back this asset.
     *
     * @class AudioManager
     * @constructs
     * @param context {AudioContext} An instance of the Web Audio API AudioContext
     * @param audioBinary {binary} Pre-loaded audio binary data
     */
    var AudioManager = function(context, audioBinary) {
        this.context = context;
        this.buffer = this.context.createBuffer(audioBinary, true);        
    }

    /**
     * Acts as a factory to create an audio buffer suitable for future playback.
     *
     * @returns {AudioBuffer}
     */
    AudioManager.prototype.createBuffer = function() {
        return new AudioBuffer(this.context, this.buffer);
    }
    
    /**
     * A high-level abstraction built around a Web Audio API Audio Buffer.
     *
     * @class AudioBuffer
     * @constructs
     * @param context {AudioContext} An instance of the Web Audio API AudioContext
     * @param audioBinary {binary} Pre-loaded audio binary data
     */
    var AudioBuffer = function(context, buffer) {
        this.source = context.createBufferSource();
        this.panner = context.createPanner();   
        
        this.source.connect(this.panner); // Connect source to panner
        this.panner.connect(context.destination); // Connect panner speakers
        this.source.buffer = buffer;        
    }
    
    /**
     * Play the audio asset that has been loaded into the buffer.
     *
     * @param loop {bool} True to continuously loop
     */
    AudioBuffer.prototype.play = function(loop) {
        this.source.loop = loop;
        this.source.noteOn(0);
    }
    
    /**
     * Set audio pan position based on position of an object in the game world
     *
     * @param position {Object} An object with positional properties in the form as {x:0, y:0, z:0}
     */
    AudioBuffer.prototype.setPanByPosition = function(position) {
        var panMultiplier = 1;
        var panX = (position.x / WORLD_BOUNDARY_X) * panMultiplier;
        var panY = (position.y / WORLD_BOUNDARY_Y) * panMultiplier;
        var panZ = (position.z / WORLD_BOUNDARY_Z) * panMultiplier;
        
        this.setPan(panX, panY, panZ);
    }       
    
    /**
     * Set audio pan position based on an (x,y,z) coordinate
     *
     * @param x {number} x-coordinate from which to pan
     * @param y {number} y-coordinate from which to pan
     * @param z {number} z-coordinate from which to pan
     */
    AudioBuffer.prototype.setPan = function(x, y, z) {
        this.panner.setPosition(x, y, z);
    }

    return AudioManager;
});