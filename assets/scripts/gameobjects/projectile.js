/**
 * @fileOverview
 * Projectile Class File
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
    
    var BOUND_Z = -3500;
    var HORIZON_DEPTH = 2000;

    var Projectile = function(position, image) {
        this.active = true;
        this.velocity = new THREE.Vector3(0, 0, -2);
        this.size = 30;

        /**
        * Decrement enemy hp by this value upon collision
        */
        this.strength = 1; 
        this.mesh = new THREE.Sprite( { color: 0xffffff, map: new THREE.Texture(image), useScreenCoordinates: false } );
        this.mesh.map.needsUpdate = true;
        this.mesh.scale.set(1.5, 1.5, 1.5);
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.objectRef = this;
    }
    
    Projectile.prototype.addTo = function(parent) {
        parent.add(this.mesh);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    
    Projectile.prototype.onCollision = function(enemy) {
        this.active = false;
    }

	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////

    Projectile.prototype.update = function(elapsed) {
        var position = this.mesh.position;
        position.z += this.velocity.z * elapsed;

        if (position.z < BOUND_Z + HORIZON_DEPTH) {
            
            //fade out closer to horizon;
            var horizonPercent = ((BOUND_Z + HORIZON_DEPTH) - position.z) / HORIZON_DEPTH;
            this.mesh.opacity = this.mesh.opacity * (1 - horizonPercent);
        }       
        
        if (position.z < BOUND_Z) {
            this.active = false;
        }
    }
    
    Projectile.prototype.collidesWith = function(collidable) {
        var collidedEnemy = collidable.collidesWith(this.mesh.position);
        return collidedEnemy;
    }
    
    return Projectile;
});