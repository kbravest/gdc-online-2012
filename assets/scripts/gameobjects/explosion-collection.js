/**
 * @fileOverview
 * ExplosionCollection Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib/events',
        'gameobjects/explosion',
        'lib-thirdparty/three'
    ], 
    function(
        Events,
        Explosion
    ) {
    
    "use strict";
    
    var NUM_SPRITE_BUFFERS = 10;

    var ExplosionCollection = function(explosionImage, explosionAudio) {
        this.explosionImage = explosionImage;
        this.explosionAudio = explosionAudio;
  
        this.explosionGroup = new THREE.Object3D();
        
        this.spriteBufferIndex = 0;
        this.spriteBuffers = [];
        this.fillSpriteBuffers();
    }
    
    ExplosionCollection.prototype.fillSpriteBuffers = function(parent) {  
        for (var i = 0; i < NUM_SPRITE_BUFFERS; i++) {
            this.spriteBuffers[i] = new Explosion(this.explosionImage);
        }   
    }    
    
    ExplosionCollection.prototype.addTo = function(parent) {
        parent.add(this.explosionGroup);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    
    ExplosionCollection.prototype.createLargeExplosion = function(position) {
        this.createExplosion(position, 4.5);
    }    
    
    ExplosionCollection.prototype.createSmallExplosion = function(position) {
        this.createExplosion(position, 2);
    }    
    
    ExplosionCollection.prototype.createExplosion = function(position, scale) {
        var explosion = this.spriteBuffers[this.spriteBufferIndex];
        explosion.init(position, scale);
        explosion.addTo(this.explosionGroup);
        
        this.spriteBufferIndex++;
        if (this.spriteBufferIndex >= NUM_SPRITE_BUFFERS) {
            this.spriteBufferIndex = 0;
        }        

        var audioBuffer = this.explosionAudio.createBuffer();
        audioBuffer.setPanByPosition(position);
        audioBuffer.play();
    }
    
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////
 
    ExplosionCollection.prototype.update = function(elapsed) {         
        // update explosions
        var explosionLength = this.explosionGroup.children.length;
        for (var i=0; i < explosionLength; i++) {
            var explosion = this.explosionGroup.children[i];
            explosion.objectRef.update(elapsed);
        }
        
        // remove inactive explosions
        for (var i=0; i < this.explosionGroup.children.length; i++) {
            var explosion = this.explosionGroup.children[i];
            
            if (!explosion.objectRef.active) {
                this.explosionGroup.remove(explosion);
                i--;
            }
        }       
     }
 
    return ExplosionCollection;
});