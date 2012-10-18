/**
 * @fileOverview
 * Light Class File
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
    
    var Light = function() {     
        this.ambientLight = new THREE.AmbientLight(0x888888);

        // create a point light
        this.pointLight = new THREE.PointLight(0x555555);
        this.pointLight.position.set(500, 500, 0);

        this.pointLight1 = new THREE.PointLight(0x555555);
        this.pointLight1.position.set(0, 0, 10);      
    }
    
    Light.prototype.addTo = function(parent) {
        parent.add(this.ambientLight);
        parent.add(this.pointLight);
        parent.add(this.pointLight1);
    }
        
    return Light;
});