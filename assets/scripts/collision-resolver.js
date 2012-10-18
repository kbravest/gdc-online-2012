/**
 * @fileOverview
 * CollisionResolver Class File
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

    var CollisionResolver = function() {
        this.projectileCollidables = null;
        this.enemyCollidables = null;
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
     
    CollisionResolver.prototype.setProjectileCollidables = function(projectileCollidables) {
        this.projectileCollidables = projectileCollidables;   
    }
    
    CollisionResolver.prototype.setEnemyCollidables = function(enemyCollidables) {
        this.enemyCollidables = enemyCollidables;    
    }
    
    //////////////////////////////////////////////////////////////////////
	// update
    //////////////////////////////////////////////////////////////////////
    
    CollisionResolver.prototype.update = function(elapsed) {
        var projectileCollidablesLength = this.projectileCollidables.length;
        
        for (var i=0; i < projectileCollidablesLength; i++) {
            var projectile = this.projectileCollidables[i].objectRef;
            var enemyCollidablesLength = this.enemyCollidables.length;
            
            for (var j=0; j < enemyCollidablesLength; j++) {
                var enemy = this.enemyCollidables[j].objectRef;
                var isCollision = enemy.collidesWith(projectile);
                
                if (isCollision) {
                    enemy.onCollision(projectile);
                    projectile.onCollision(enemy);
                    break;
                }
            }
        }
    }
    
    return CollisionResolver;
});