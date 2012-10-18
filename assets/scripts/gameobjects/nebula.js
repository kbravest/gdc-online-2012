/**
 * @fileOverview
 * Nebula Class File
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
  
    var Nebula = function(image, inputState) {   
        this.inputState = inputState;

        this.isDirty = true;
        this.nebulaGroup = new THREE.Object3D();
        this.nebulaGroup.position.set(0, 0, -5000);
       
        var nebula = new THREE.Sprite( { color: 0xffffff, map: new THREE.Texture(image) } );
        nebula.useScreenCoordinates = false;
        nebula.affectedByDistance = true; //size is affected by z-coordinate
        nebula.mergeWith3D = true; //true to consider z-depth
        nebula.scaleByViewport = false;
        nebula.scale.set(30,30,30);
        nebula.map.needsUpdate = true;
        this.nebulaGroup.add(nebula);
    }
    
    Nebula.prototype.addTo = function(parent) {
        parent.add(this.nebulaGroup);
    }
    
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////

    Nebula.prototype.update = function(elapsed) {
    }

    return Nebula;
});