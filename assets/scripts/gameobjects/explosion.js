/**
 * @fileOverview
 * Explosion Class File
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
    
    var TIME_PER_FRAME = 30;
    var FRAME_COUNT_X = 5;
    var FRAME_COUNT_Y = 5;

    var Explosion = function(image) {
        this.mesh = new THREE.Sprite( { color: 0xffffff, map: new THREE.Texture(image), useScreenCoordinates: false } );
        this.mesh.map.needsUpdate = true;
        this.mesh.opacity = 0.9;
        this.mesh.rotation = Math.random() * Math.PI * 2;
        this.mesh.objectRef = this;
    }
    
    Explosion.prototype.init = function(position, scale) {
        this.elapsed = 0;
        this.currentFrameX = 0;
        this.currentFrameY = 0;
        this.active = true;
        
        if (position != null) { 
            this.setPosition(position);
        }
        if (scale != null) {
            this.setScale(scale);
        }
        this.setUv();
    }       
    
    Explosion.prototype.addTo = function(parent) {
        parent.add(this.mesh);
    }

	//////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////

    Explosion.prototype.setPosition = function(position) {
        this.mesh.position.set(position.x, position.y, position.z);
    }
    
    Explosion.prototype.setScale = function(scale) {
        this.mesh.scale.set(scale, scale);
    }    
    
    Explosion.prototype.setNextFrame = function() {
        this.currentFrameX++;
        
        if (this.currentFrameX >= FRAME_COUNT_X) {
            this.currentFrameX = 0;
            this.currentFrameY++;
        }
        
        if (this.currentFrameY >= FRAME_COUNT_Y) {
            //this.currentFrameY = 0; //to loop continuously
            this.active = false;
        }
    }
    
    Explosion.prototype.setUv = function() {
		this.mesh.uvOffset.x = (1 / FRAME_COUNT_X) * this.currentFrameX;
        this.mesh.uvOffset.y = (1 / FRAME_COUNT_Y) * this.currentFrameY;
	    this.mesh.uvScale.x = 1 / FRAME_COUNT_X;
        this.mesh.uvScale.y = 1 / FRAME_COUNT_Y;
    }

	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////
    
    Explosion.prototype.update = function(elapsed) {
        this.elapsed = this.elapsed + elapsed;
        
        if (this.elapsed > TIME_PER_FRAME) {
            this.elapsed = this.elapsed - TIME_PER_FRAME;
            this.setNextFrame();
            this.setUv();
        }
    }

    return Explosion;
});