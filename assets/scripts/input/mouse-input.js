/**
 * @fileOverview
 * MouseInput Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib/events'
    ], 
    function(
        Events
    ) {
    
    "use strict"; 
    
    // constants
    var BUTTON_LEFT = 1;
    var BUTTON_MIDDLE = 2;
    var BUTTON_RIGHT = 3;
    
    var INPUT_SENSITIVITY = 1;

    var MouseInput = function(stage) {
        this.stage = stage;

        // the current input state
        this.position = {};
        this.position.movementX = 0;
        this.position.movementY = 0;
        this.buttons = [];
        this.buttons[BUTTON_LEFT] = false;
        this.buttons[BUTTON_MIDDLE] = false;
        this.buttons[BUTTON_RIGHT] = false;
        
        this.state = {};
        this.state.fire = false;
        this.state.cameraVx = 0;
        this.state.cameraVy = 0;
        
        this.isDirty = false;
        
        this.bindEvents();
    }
    
    MouseInput.prototype.update = function() {
        // here we map specific keys/buttons to an input state
        this.state.fire = this.buttons[BUTTON_LEFT] || this.buttons[BUTTON_MIDDLE] || this.buttons[BUTTON_RIGHT];
        
        this.state.cameraVx = this.position.movementX * INPUT_SENSITIVITY;
        this.state.cameraVy = this.position.movementY * INPUT_SENSITIVITY;
        this.position.movementX = 0;
        this.position.movementY = 0;
        
        this.isDirty = false;
    }
    
	//////////////////////////////////////////////////////////////////////
	// event handlers
    //////////////////////////////////////////////////////////////////////
	
    MouseInput.prototype.bindEvents = function() {
        var self = this;
            
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.stage.scene.addEventListener('mousedown', this.onMouseDown.bind(this));
        
        // in pointer-lock mode, we must listen on the entire document, or else clicks will not register
        document.addEventListener('mousedown', this.onMouseDownPointerLock.bind(this));
    }

    MouseInput.prototype.onMouseMove = function(e) {
        if (e.webkitMovementX != null) {
            this.position.movementX += e.webkitMovementX;
            this.isDirty = true;
        }
        
        if (e.webkitMovementY != null) {
            this.position.movementY += e.webkitMovementY;
            this.isDirty = true;
        }
    }

    MouseInput.prototype.onMouseDown = function(e) {
        if (!this.stage.isPointerLock()) {
            var button = this.buttons[e.which];
         
            if (button != null) {
                this.buttons[e.which] = true;
                this.isDirty = true;
                
                e.preventDefault();
                return false;
            }
        }
    }
    
    MouseInput.prototype.onMouseDownPointerLock = function(e) {
        if (this.stage.isPointerLock()) {
            var button = this.buttons[e.which];
         
            if (button != null) {
                this.buttons[e.which] = true;
                this.isDirty = true;
                
                e.preventDefault();
                return false;
            }
        }
    }    
    
    MouseInput.prototype.onMouseUp = function(e) {
        var button = this.buttons[e.which];
     
        if (button != null) {
            this.buttons[e.which] = false;
            this.isDirty = true;
            
            e.preventDefault();
            return false;
        }
    }
    
    return MouseInput;   
});