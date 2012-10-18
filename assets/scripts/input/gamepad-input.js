/**
 * @fileOverview
 * GamepadInput Class File
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
        
    // The following button mapping is specific to Logitech Gamepad F310 (Xbox 360 clone)
    var BUTTON_X = 2;
    var BUTTON_Y = 3;    
    var BUTTON_A = 0;
    var BUTTON_B = 1;
    var BUTTON_START = 9;
    var BUTTON_BACK = 8;
    var BUTTON_RB = 5;
    var BUTTON_LB = 4;
    var BUTTON_LT = 6;
    var BUTTON_RT = 7;
    var DPAD_LEFT = 14;
    var DPAD_UP = 12;
    var DPAD_DOWN = 13;
    var DPAD_RIGHT = 15;
    
    var AXIS_0_VERTICAL = 1;
    var AXIS_0_HORIZONTAL = 0;
    var AXIS_1_VERTICAL = 3;
    var AXIS_1_HORIZONTAL = 2;
    var AXIS_DEAD_ZONE = 0.01;
    
    var INPUT_SENSITIVITY = 25;

    var GamepadInput = function() {
        // the current input state
        this.axes = [];
        this.axes[0] = 0;
        this.axes[1] = 0;
        this.axes[2] = 0;
        this.axes[3] = 0;
    
        this.buttons = [];
        this.buttons[0] = false;
        this.buttons[1] = false;
        this.buttons[2] = false;
        this.buttons[3] = false;
        this.buttons[4] = false;
        this.buttons[5] = false;
        this.buttons[6] = false;
        this.buttons[7] = false;
        this.buttons[8] = false;
        this.buttons[9] = false;
        this.buttons[10] = false;
        this.buttons[11] = false;
        this.buttons[12] = false;
        this.buttons[13] = false;
        this.buttons[14] = false;
        this.buttons[15] = false;
 
        this.state = {};
        this.state.fire = false;
        this.state.shipVx = 0;
        this.state.shipVy = 0;
        this.state.cameraVx = 0;
        this.state.cameraVy = 0;
        
        this.isDirty = false;
    }
    
    GamepadInput.prototype.update = function() {
        // here we map specific keys/buttons to an input state
        this.state.fire = this.buttons[BUTTON_X] || this.buttons[BUTTON_Y] || this.buttons[BUTTON_A] || this.buttons[BUTTON_B];
        
        this.state.shipVx = (this.buttons[DPAD_LEFT] ? -1: this.buttons[DPAD_RIGHT] ? 1 : 0);
        this.state.shipVy = (this.buttons[DPAD_UP] ? -1: this.buttons[DPAD_DOWN] ? 1 : 0);

        this.state.cameraVx = (this.axes[AXIS_0_HORIZONTAL] + this.axes[AXIS_1_HORIZONTAL]) * INPUT_SENSITIVITY;
        this.state.cameraVy = (this.axes[AXIS_0_VERTICAL] + this.axes[AXIS_1_VERTICAL]) * INPUT_SENSITIVITY;     

        this.axes[AXIS_0_HORIZONTAL] = 0;
        this.axes[AXIS_0_VERTICAL] = 0;
        this.axes[AXIS_1_HORIZONTAL] = 0;
        this.axes[AXIS_1_VERTICAL] = 0;

         this.isDirty = false;
    }    
    
    /**
    * Since Chrome provides only a snapshot of the current gamepad state via polling,
    * we need to simulate ButtonDown and ButtonUp events based on a detected change of state
    */
    GamepadInput.prototype.pollForGamepads = function() {
        var gamepads = navigator.webkitGetGamepads();
        
        if (gamepads == null) { 
            return;
        }
        
        for (var gamepadindex = 0; gamepadindex < gamepads.length; gamepadindex++) {
            var gamepad = gamepads[gamepadindex];
            
            if (gamepad != null) {
                for (var i = 0; i < gamepad.axes.length; i++) {
                   this.onGamepadAxisMove(i, gamepad.axes[i]);
                }
                for (var i = 0; i < gamepad.buttons.length; i++) {
                    if (this.buttons[i] === false && gamepad.buttons[i] === 1) {
                        this.onGamepadButtonDown(i);
                    }
                    else if (this.buttons[i] === true && gamepad.buttons[i] === 0) {
                        this.onGamepadButtonUp(i);
                    }
                }
            }
        }
    }    
    
	//////////////////////////////////////////////////////////////////////
	// event handlers
    //////////////////////////////////////////////////////////////////////

    GamepadInput.prototype.onGamepadButtonDown = function(which) {
        var button = this.buttons[which];
        
        if (button != null) {
            this.buttons[which] = true;
            this.isDirty = true;
        }
    }

    GamepadInput.prototype.onGamepadButtonUp = function(which) {
        var button = this.buttons[which];
        
        if (button != null) {
            this.buttons[which] = false;
            this.isDirty = true;
        }
    }
    
    GamepadInput.prototype.onGamepadAxisMove = function(axis, value) {
    
        if (Math.abs(value) > AXIS_DEAD_ZONE) {
            this.axes[axis] += value;
            this.isDirty = true;
        }
    }
    
	//////////////////////////////////////////////////////////////////////
	// helpers
    //////////////////////////////////////////////////////////////////////
    
    return GamepadInput;   
});