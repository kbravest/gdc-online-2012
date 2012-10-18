/**
 * @fileOverview
 * KeyboardInput Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
    ], 
    function(
    ) {
    
    "use strict"; 
    
    // constants
    var KEY_SPACE = 32;
    var KEY_ENTER = 13;    
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_W = 87;
    var KEY_A = 65;
    var KEY_S = 83;
    var KEY_D = 68;
    
    var INPUT_SENSITIVITY = 20;

    var KeyboardInput = function() {
        this.isDirty = true;
        
        // the current input state
        this.state = {};
        this.state.fire = false;
        this.state.cameraVx = 0;
        this.state.cameraVy = 0;
        this.state.shipVx = 0;
        this.state.shipVy = 0;
        
        this.reset();
        this.bindEvents();
    }
    
    KeyboardInput.prototype.reset = function() {
        this.keys = {};
        this.keys[KEY_SPACE] = false;
        this.keys[KEY_ENTER] = false;
        this.keys[KEY_LEFT] = false;
        this.keys[KEY_RIGHT] = false;
        this.keys[KEY_UP] = false;
        this.keys[KEY_DOWN] = false;
        this.keys[KEY_A] = false;
        this.keys[KEY_D] = false;
        this.keys[KEY_W] = false;
        this.keys[KEY_S] = false;
        this.isDirty = true;        
    }
    
    KeyboardInput.prototype.update = function() { 
        this.state.fire = this.keys[KEY_SPACE] || this.keys[KEY_ENTER];
        
        this.state.cameraVx = (this.keys[KEY_LEFT] ? -1: this.keys[KEY_RIGHT] ? 1 : 0) * INPUT_SENSITIVITY;
        this.state.cameraVy = (this.keys[KEY_UP] ? -1: this.keys[KEY_DOWN] ? 1 : 0) * INPUT_SENSITIVITY;
        
        this.state.shipVx = (this.keys[KEY_A] ? -1: this.keys[KEY_D] ? 1 : 0);
        this.state.shipVy = (this.keys[KEY_W] ? -1: this.keys[KEY_S] ? 1 : 0);
        
        this.isDirty = false;
    }

	//////////////////////////////////////////////////////////////////////
	// event handlers
    //////////////////////////////////////////////////////////////////////
	
    KeyboardInput.prototype.bindEvents = function() {
        var self = this;
        
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('blur', this.onBlur.bind(this));
    }

    KeyboardInput.prototype.onBlur = function(e) {
        this.reset();
    }
    
    KeyboardInput.prototype.onKeyDown = function(e) {
        var key = this.keys[e.which];
     
        if (key != null) {
            this.keys[e.which] = true;
            this.isDirty = true;
            
            e.preventDefault();
            return false;
        }
    }

    KeyboardInput.prototype.onKeyUp = function(e) {
        var key = this.keys[e.which];
        
        if (key != null) {
            this.keys[e.which] = false;
            this.isDirty = true;
            
            e.preventDefault();
            return false;
        }
    }

    return KeyboardInput;   
});