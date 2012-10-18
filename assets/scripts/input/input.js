/**
 * @fileOverview
 * Input Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define(
    [
        'input/mouse-input',
        'input/gamepad-input',
        'input/keyboard-input'
    ], 
    function(
        MouseInput,
        GamepadInput,
        KeyboardInput
    ) {
    
    "use strict"; 
    
    var Input = function(stage) {
        this.stage = stage;
        
        this.state = {}
        this.state.fire = false;
        this.state.shipVx = 0;
        this.state.shipVy = 0;
        this.state.cameraVx = 0;
        this.state.cameraVy = 0;
        this.state.cameraCumulativeVx = 0;
        this.state.cameraCumulativeVy = 0;
        
        this.mouseInput = new MouseInput(this.stage);
        this.keyboardInput = new KeyboardInput();
        this.gamepadInput = new GamepadInput();
    }
    
    Input.prototype.update = function() {
        this.gamepadInput.pollForGamepads();
        
        this.state.cameraCumulativeVx = 0;
        this.state.cameraCumulativeVy = 0;
    
        if (this.mouseInput.isDirty || this.keyboardInput.isDirty || this.gamepadInput.isDirty) {
            this.mouseInput.update();
            this.keyboardInput.update();
            this.gamepadInput.update();
        
            this.state.fire = this.mouseInput.state.fire || this.keyboardInput.state.fire || this.gamepadInput.state.fire;

            this.state.shipVx = this.keyboardInput.state.shipVx || this.gamepadInput.state.shipVx;
            this.state.shipVy = this.keyboardInput.state.shipVy || this.gamepadInput.state.shipVy;

            this.state.cameraVx = this.keyboardInput.state.cameraVx;
            this.state.cameraVy = this.keyboardInput.state.cameraVy;           
            
            this.state.cameraCumulativeVx += this.mouseInput.state.cameraVx + this.gamepadInput.state.cameraVx;
            this.state.cameraCumulativeVy += this.mouseInput.state.cameraVy + this.gamepadInput.state.cameraVy;
        }
    }

    return Input;   
});