/**
 * @fileOverview
 * ProjectileCollection Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */
 
define([
        'lib/events',
        'gameobjects/projectile',
        'lib-thirdparty/three'
    ], 
    function(
        Events,
        Projectile
    ) {
    
    "use strict";
    
    var PROJECTILE_SPREAD_X = 140;
    var TIME_BETWEEN_MIN = 100;
    
    var ProjectileCollection = function(image, audio) {
        this.image = image;
        this.audio = audio;

        this.timeOfLast = 0;
        this.projectileGroup = new THREE.Object3D();
    }
    
    ProjectileCollection.prototype.addTo = function(parent) {
        parent.add(this.projectileGroup);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
     
    ProjectileCollection.prototype.createProjectile = function(position) {
        var currentTime = new Date().getTime();
        
        var elapsed = currentTime - this.timeOfLast;
        if (elapsed > TIME_BETWEEN_MIN) {
            var positionLeft = position.clone();
            positionLeft.x -= PROJECTILE_SPREAD_X;

            var positionRight = position.clone();
            positionRight.x += PROJECTILE_SPREAD_X;
            
            var projectileLeft = new Projectile(positionLeft, this.image);
            projectileLeft.addTo(this.projectileGroup);
            
            var projectileRight = new Projectile(positionRight, this.image);
            projectileRight.addTo(this.projectileGroup);            
            
            this.timeOfLast = new Date().getTime();
            var audioBuffer = this.audio.createBuffer();
            audioBuffer.setPanByPosition(position);
            audioBuffer.play();
        }
    }

	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////
 
    ProjectileCollection.prototype.update = function(elapsed) {
        // update projectile position
        var projectileLength = this.projectileGroup.children.length;
        for (var i=0; i < projectileLength; i++) {
            var projectile = this.projectileGroup.children[i];
            projectile.objectRef.update(elapsed);
        }
        
        // remove inactive projectiles
        for (var i=0; i < this.projectileGroup.children.length; i++) {
            var projectile = this.projectileGroup.children[i];
            
            if (!projectile.objectRef.active) {
                this.projectileGroup.remove(projectile);
                i--;
            }            
        }
     }
 
    return ProjectileCollection;
});