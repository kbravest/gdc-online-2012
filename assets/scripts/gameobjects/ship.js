/**
 * @fileOverview
 * Ship Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib-thirdparty/three'
    ], 
    function(
    ) {
    
    "use strict";
    
    var BOUND_POSITION_X = 700;
    var BOUND_POSITION_Y = 700;
    var BOUND_ROTATION_X = Math.PI / 4;
    var BOUND_ROTATION_Z = Math.PI / 4;
    var INPUT_SENSITIVITY = 10;

    var Ship = function(shipGeometry, shipAudio, inputState) {   
        this.shipAudio = shipAudio;
        this.inputState = inputState;
        this.projectileCollection = null;
        
        this.size = 100;     
        this.targetRotation = new THREE.Vector3(0,0,0);
        
        this.mesh = new THREE.Object3D();
        
        this.shipMesh = new THREE.Mesh(shipGeometry, new THREE.MeshFaceMaterial());
   
        this.mesh.scale.set(6,6,6);
        this.mesh.rotation.y = Math.PI;
        this.mesh.position.y = -250;
        
        var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        material.opacity = 0.2;
        material.transparent = true;
        material.ambient = new THREE.Color('0xFF0000');

        this.thruster0 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 50, 20, 20, false), material);
        this.thruster0.rotation.x = Math.PI / 2;
        this.thruster0.rotation.z = Math.PI;
        this.thruster0.position.set(-15, 2, -50);
        this.mesh.add(this.thruster0);
                
        this.thruster1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 50, 20, 20, false), material);
        this.thruster1.rotation.x = Math.PI / 2;
        this.thruster1.rotation.z = Math.PI;
        this.thruster1.position.set(15, 2, -50);
        this.mesh.add(this.thruster1);
        
        this.thrusterThrob = 0;
        
        this.mesh.add(this.shipMesh);
        
        this.audioBuffer = this.shipAudio.createBuffer();
        this.audioBuffer.play(true);
    }
    
    Ship.prototype.addTo = function(parent) {
        parent.add(this.mesh);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    
    Ship.prototype.setProjectile = function(projectileCollection) {
        this.projectileCollection = projectileCollection;
    }
    
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////

    Ship.prototype.update = function(elapsed) {
        var targetRotation = this.targetRotation;
        var position = this.mesh.position;
        
        // fire
        if (this.inputState.fire) {
            this.projectileCollection.createProjectile(position);
        }
        
        if (this.inputState.shipVx < 0) {
            position.x += this.inputState.shipVx * INPUT_SENSITIVITY;
            targetRotation.z = -BOUND_ROTATION_Z;
            
        } else if (this.inputState.shipVx > 0) {
            position.x += this.inputState.shipVx * INPUT_SENSITIVITY;
            targetRotation.z = BOUND_ROTATION_Z;
        }
        else {
            targetRotation.z = 0;
        } 
        
        if (this.inputState.shipVy < 0) {
            position.y -= this.inputState.shipVy * INPUT_SENSITIVITY;
            targetRotation.x = BOUND_ROTATION_X;
        } else if (this.inputState.shipVy > 0) {
            position.y -= this.inputState.shipVy * INPUT_SENSITIVITY;
            targetRotation.x = -BOUND_ROTATION_X;
        }
        else {
            targetRotation.x = 0;
        }

        // apply rotation
        var rotation = this.mesh.rotation;
        rotation.z += (this.targetRotation.z - rotation.z) / 2;
        rotation.x += (this.targetRotation.x - rotation.x) / 2;
        
        // bound check
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

        this.audioBuffer.setPanByPosition(position);
  
        this.thrusterThrob += 1.8;
        if (this.thrusterThrob > Math.PI * 2) { this.thrusterThrob = 0; }
        
        var throbAmount = 0.8 + Math.sin(this.thrusterThrob) * 0.2
        this.thruster0.scale.x = throbAmount;
        this.thruster1.scale.x = throbAmount;
        this.thruster0.scale.z = throbAmount;
        this.thruster1.scale.z = throbAmount;                        
    }

    return Ship;
});