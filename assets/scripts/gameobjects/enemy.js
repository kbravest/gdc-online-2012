/**
 * @fileOverview
 * Enemy Class File
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

    var LEFT_FACE = 0;
    var RIGHT_FACE = 1;
    var TOP_FACE = 2;
    var BOTTOM_FACE = 3;
    var FRONT_FACE = 4;
    var BACK_FACE = 5
    
    var Enemy = function(id, sideImage, faceImage, dieAudio, position, width, height, depth, rotateDivisor) {
        this.id = id;
        this.sideImage = sideImage;
        this.faceImage = faceImage;
        this.dieAudio = dieAudio;
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.scoreValue = 100;
        this.hpTotal = 3;
        this.hp = this.hpTotal;
        this.active = true;
        this.targetRotation = new THREE.Vector3(0,0,0.1);
        this.rotateDivisor = rotateDivisor
        this.direction = 1;
 
        var materials = [];
        materials[LEFT_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });
        materials[RIGHT_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });
        materials[TOP_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });
        materials[BOTTOM_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });
        materials[FRONT_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });
        materials[BACK_FACE] = new THREE.MeshLambertMaterial({ color: 0xffffff, map: new THREE.Texture(sideImage) });

        for (var i=0; i < materials.length; i++) {
            materials[i].map.needsUpdate = true;
        }

        this.mesh = new THREE.Mesh(new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1, materials), new THREE.MeshFaceMaterial()); 
        
        this.mesh.position.set(
            position.x + Math.random() * -5000 + 2500, 
            position.y + Math.random() * -5000 + 2500, 
            position.z + Math.random() * -50000 - 1000
        );
        
        this.mesh.objectRef = this;
        this.targetPosition = new THREE.Vector3(position.x, position.y, position.z);
        this.explosionCollection = null;
        this.score = null;
    }
    
    Enemy.prototype.addTo = function(parent) {
        parent.add(this.mesh);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    
    Enemy.prototype.setExplosionCollection = function(explosionCollection) {
        this.explosionCollection = explosionCollection;
    }
    
    Enemy.prototype.setScore = function(score) {
        this.score = score;
    }
        
    Enemy.prototype.updateTexture = function() {
        var map = this.mesh.geometry.materials[FRONT_FACE].map;
    
        map.needsUpdate = true;
    }
    
    Enemy.prototype.setTexture = function(texture) {
        var map = this.mesh.geometry.materials[FRONT_FACE].map;
        
        map.image = texture;
        map.needsUpdate = true;
    }
    
    Enemy.prototype.getFaceImage = function() {
        return this.faceImage;
    }
    
    Enemy.prototype.setPosition = function(parentPosition) {
        var position = this.mesh.position;
    
        var x = position.x + parentPosition.x;
        var y = position.y + parentPosition.y;
        var z = position.z + parentPosition.z;
        
        this.left = x - this.width / 2;
        this.right = x + this.width / 2; 
        this.top = y - this.height / 2;
        this.bottom = y + this.height / 2;
        this.near = z + this.depth / 2;
        this.far = z - this.depth / 2;
    }

    Enemy.prototype.getMidPosition = function() {
        var position = new THREE.Vector3(this.left + this.width / 2, this.top + this.height / 2, this.far + this.depth / 2);
        return position;
    } 
    
    Enemy.prototype.getFrontPosition = function() {
        var position = new THREE.Vector3(this.left, this.top, this.near + 50);
        return position;
    }    
    
    Enemy.prototype.collidesWith = function(projectile) {
        var x = projectile.mesh.position.x;
        var y = projectile.mesh.position.y;
        var z = projectile.mesh.position.z;
    
        if (
            x > this.left && x < this.right &&
            y > this.top && y < this.bottom &&
            z > this.far && z < this.near) {
            
            return true;
        }
        return false;
    }
    
    Enemy.prototype.onCollision = function(projectile) {
        this.incrementHp(-projectile.strength);
        
        var explosionPosition = this.getFrontPosition();
        explosionPosition.x = projectile.mesh.position.x;
        explosionPosition.y = projectile.mesh.position.y;
        
        this.explosionCollection.createSmallExplosion(explosionPosition);        
    }
    
    Enemy.prototype.incrementHp = function(amount) {
        this.hp += amount;
        
        // adjust color based on hp
        var hpPercent = this.hp / this.hpTotal;

        var color = 255 * hpPercent;
        var material = this.mesh.geometry.materials[FRONT_FACE];
        material.ambient = new THREE.Color(color, color, color);

        if (this.hp <= 0) {
            this.hp = 0;
            this.destroy();
        }    
    }
    
    Enemy.prototype.destroy = function() {
        this.active = false;
        
        var position = this.getMidPosition();
        
        var audioBuffer = this.dieAudio.createBuffer();
        audioBuffer.setPanByPosition(position);
        audioBuffer.play();
        
        this.explosionCollection.createLargeExplosion(position);
        
        this.score.increment(this.scoreValue);
    }
    
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////
    
     Enemy.prototype.tween = function() {
        var position = this.mesh.position;
        var divisor = 7;
        
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
        
        if (atRest) {
            position.x = this.targetPosition.x;
            position.y = this.targetPosition.y;
            position.z = this.targetPosition.z;
            this.introStep++;
        }
    }   

    
    Enemy.prototype.update = function(elapsed) {
        this.tween();
    
        this.mesh.rotation.z += (this.targetRotation.z - this.mesh.rotation.z) / this.rotateDivisor;

        if (this.direction === -1 && this.mesh.rotation.z < this.targetRotation.z + 0.001) {
            this.mesh.rotation.z = this.targetRotation.z - 0.01;
            this.targetRotation.z = -this.targetRotation.z;
            this.direction = 1;

        } else if (this.direction === 1 && this.mesh.rotation.z > this.targetRotation.z - 0.001) {
            this.mesh.rotation.z = this.targetRotation.z + 0.01;
            this.targetRotation.z = -this.targetRotation.z;
            this.direction = -1;
        }
    }

    return Enemy;
});