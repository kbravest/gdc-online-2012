/**
 * @fileOverview
 * Starfield Class File
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
    
    var NEAR = 300;
    var FAR = -3000;
    var VELOCITY = 100;
    var NUM_PARTICLES = 100;
    var SIZE = 20;
    var BOUND_X = 1000;
    var BOUND_Y = 1000;
    
    var Starfield = function() {
        this.starGeometry = new THREE.Geometry(); 
        this.starParticleSystem = null;         
        this.createStarGeometry();
    }
    
    Starfield.prototype.addTo = function(parent) {
        parent.add(this.starParticleSystem);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    Starfield.prototype.createStarGeometry = function() { 

        for (var i = 0; i < NUM_PARTICLES; i++ ) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * BOUND_X * 2 - BOUND_X;
            vertex.y = Math.random() * BOUND_Y * 2 - BOUND_Y;
            vertex.z = FAR + (i * (NEAR - FAR) / NUM_PARTICLES);

            this.starGeometry.vertices.push(vertex);
        }
        
        var material = new THREE.ParticleBasicMaterial( { color: 0xffffff, size: SIZE, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.5 } );
        
        this.starParticleSystem = new THREE.ParticleSystem(this.starGeometry, material);
        this.starParticleSystem.sortParticles = true; 
    }
    
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////

    Starfield.prototype.update = function(elapsed) {
        for (var i = 0; i < this.starGeometry.vertices.length; i++) {
            var vertex = this.starGeometry.vertices[i];   
            
            vertex.z += VELOCITY;
            
            if (vertex.z > NEAR) {
                vertex.x = Math.random() * BOUND_X * 2 - BOUND_X;
                vertex.y = Math.random() * BOUND_Y * 2 - BOUND_Y;
                vertex.z -= (NEAR - FAR);
            }
        }
        
        this.starParticleSystem.geometry.__dirtyVertices = true;
    }

    return Starfield;
});