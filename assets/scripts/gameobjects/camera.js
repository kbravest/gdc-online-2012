/**
 * @fileOverview
 * Camera Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib/events',
        'lib-thirdparty/three'
	], function(
        Events
    ) {

    "use strict"; 

    var BOUND_POSITION_X = 2800;
    var BOUND_POSITION_Y = 2800;

    var INPUT_SENSITIVITY = 1;
        
    /** @lends Camera */

    /**
     * @constructs
     * @class A camera which can navigate the 3D scene
     * @extends Base
     * @param width {int} Width of the scene, used to determine aspect ratio
     * @param height {int} Height of the scene, used to determine aspect ratio
     */
    var Camera = function(width, height, inputState) {
        this.baseElevation = -Math.PI / 8;
        this.enemyCollection = null;
        
        this.elapsed = 0;
        
        this.inputState = inputState;
        this.viewAngleInDegrees = 45;
        this.near = 0.1;
        this.far = 50000;
        this.aspect = width / height; // a function of stage width & height

        // options
        this.pixelsPerRadian = 0.01; //controls how fast mouse movement will influence rotation speed
        this.mesh = new THREE.PerspectiveCamera(this.viewAngleInDegrees, this.aspect, this.near, this.far);
        this.targetLookAt = new THREE.Vector3(0,0,0);
        this.lookAt = new THREE.Vector3(0,0,0);
        this.targetPosition = new THREE.Vector3(0,0,0);
        this.mesh.position.set(0,0,0);
        this.introStep = 0;
    }
    
    Camera.prototype.addTo = function(parent) {
        parent.add(this.mesh);
    }
    
    //////////////////////////////////////////////////////////////////////
    // event handlers
    //////////////////////////////////////////////////////////////////////
           
    Camera.prototype.bindEvents = function() {
    }
    
    Camera.prototype.unbindEvents = function() {
    }
    
    Camera.prototype.setEnemyCollection = function(enemyCollection) {
        this.enemyCollection = enemyCollection;
    }
    
    //////////////////////////////////////////////////////////////////////
    // update / render
    //////////////////////////////////////////////////////////////////////
    
    Camera.prototype.tween = function() {
        var position = this.mesh.position;
        var lookAt = this.lookAt;
        
        var divisor = 30;
        
        var atRest = true;
        
        var deltaX = this.targetPosition.x - position.x;
        if (Math.abs(deltaX) > 10) {
            position.x = position.x + (deltaX / divisor);
            atRest = false;
        }
        else {
            position.x = this.targetPosition.x;
        }
        
        var deltaY = this.targetPosition.y - position.y;
        if (Math.abs(deltaY) > 10) {
            position.y = position.y + (deltaY / divisor);
            atRest = false;
        }
        else {
            position.y = this.targetPosition.y;
        }
        
        var deltaZ = this.targetPosition.z - position.z;
        if (Math.abs(deltaZ) > 10) {
            position.z = position.z + (deltaZ / divisor);
            atRest = false;
        }
        else {
            position.z = this.targetPosition.z;
        }
        
        var deltaZ = this.targetLookAt.z - lookAt.z;
        if (Math.abs(deltaZ) > 10) {
            lookAt.z = lookAt.z + (deltaZ / divisor);
            atRest = false;
        }
        else {
            lookAt.z = this.targetLookAt.z;
        } 
        
        if (atRest) {
            position.x = this.targetPosition.x;
            position.y = this.targetPosition.y;
            position.z = this.targetPosition.z;

            this.introStep++;
            this.elapsed = 0;
        }
        
        this.mesh.lookAt(lookAt);
    }
    
    Camera.prototype.update = function(elapsed) {
        var position = this.mesh.position;
        this.elapsed += elapsed;
        
        // Script for the intro sequence (ideally this would be factored out into a separate controller class)
        if (this.introStep === 0) {
            this.mesh.position.set(0, 4000, -500);
            this.mesh.up.set(0, 0, -1);
            this.lookAt.set(0,0,-1000);
            this.mesh.lookAt(this.lookAt);
            
            this.introStep++
            this.elapsed = 0;
        }
        if (this.introStep === 1) {
            if (this.elapsed > 1000) {
                this.enemyCollection.resetWave(false);
                this.introStep++
                this.elapsed = 0;
            }
        }                 

        else if (this.introStep === 2) {
            if (this.elapsed > 1000) {
                this.targetPosition.set(0,0,1500);
                this.targetLookAt.set(0,0,0);
                this.introStep++
                this.elapsed = 0;
            }
        }
        else if (this.introStep === 3) {
            this.tween();
            this.mesh.up.set(0, 1, 0);
        }   
        else if (this.introStep === 4) {
            if (this.elapsed > 100) {
                this.enemyCollection.setTexture();
                this.introStep++
            }
        }            
        
        if (this.introStep >= 4) {
            position.x += -this.inputState.cameraCumulativeVx * INPUT_SENSITIVITY;
            position.y += this.inputState.cameraCumulativeVy * INPUT_SENSITIVITY;

            position.x += -this.inputState.cameraVx * INPUT_SENSITIVITY;
            position.y += this.inputState.cameraVy * INPUT_SENSITIVITY;
            
            if (position.x > BOUND_POSITION_X) {
                position.x = BOUND_POSITION_X;
            }
            else if (position.x < -BOUND_POSITION_X) {
                position.x = -BOUND_POSITION_X;
            }
            
            if (position.y > BOUND_POSITION_Y) {
                position.y = BOUND_POSITION_Y;
            }
            else if (position.y < -BOUND_POSITION_Y) {
                position.y = -BOUND_POSITION_Y;
            }
            
            this.mesh.up.set(0, 1, 0);
            this.mesh.lookAt(this.lookAt);
        }

    }

    return Camera;
});