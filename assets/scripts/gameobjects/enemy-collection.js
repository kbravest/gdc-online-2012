/**
 * @fileOverview
 * EnemyCollection Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
        'lib/util',
        'lib/events',
        'gameobjects/enemy',
        'lib-thirdparty/three'
    ], 
    function(
        Util,
        Events,
        Enemy
    ) {
    
    "use strict";

    var BOUND_X = 150;
    var BOUND_Y = 1000;
    var BOUND_Z = 1600;
    
    var FACE_TEXTURE_SIZE = 128;

    var EnemyCollection = function(faceSets, sideImage, faceForeImage, faceBackImage, dieAudio,  videoCanvasElement) {
        this.faceSets = faceSets;
        this.sideImage = sideImage;
        this.faceForeImage = faceForeImage;
        this.faceBackImage = faceBackImage;
        this.dieAudio = dieAudio;
        this.videoCanvasElement = videoCanvasElement;
        
        this.columns = 3;
        this.rows = 2;
        
        this.widthEnemy = 300;
        this.heightEnemy = 300;
        this.widthMargin = 400;
        this.heightMargin = 250;

        this.enemyGroup = new THREE.Object3D();
        this.velocity = new THREE.Vector3(0, 0, 10);
        this.faceSetIndex = 1;
        this.explosionCollection = null;
        this.score = null;
        this.videoEnabled = false;
        
        Events.bind('enablevideo', this.onEnableVideo.bind(this));
        Events.bind('disablevideo', this.onDisableVideo.bind(this));
        Events.bind('updatevideo', this.onUpdateVideo.bind(this));
    };
    
    EnemyCollection.prototype.createCompositeImage = function(imageArray) {
        var canvasBuffer = document.createElement('canvas');
        canvasBuffer.width = FACE_TEXTURE_SIZE;
        canvasBuffer.height = FACE_TEXTURE_SIZE;
        var contextBuffer = canvasBuffer.getContext('2d');  
        
        Util.renderCompositeImage(imageArray, contextBuffer, canvasBuffer.width, canvasBuffer.height);
        return canvasBuffer;
    }

    
    EnemyCollection.prototype.resetWave = function(setTexture) {
        //this.randomFaceSet();
        this.nextFaceSet();
        this.enemyGroup.position.set(0, 0, -900);
        this.createWave(3);

        if (setTexture) {
            this.setTexture();
        }
        
        this.velocity.x += 0.1;
    }    
    
    EnemyCollection.prototype.createWave = function(numRanks) {
        for (var i = 0; i < numRanks; i++) {
            this.createRank(i);
        }
        this.setPosition();
    }
    
    EnemyCollection.prototype.getCurrentFaceSet = function() {
        return this.faceSets[this.faceSetIndex];
    }

    EnemyCollection.prototype.nextFaceSet = function() {
        this.faceSetIndex++;
        if (this.faceSetIndex >= this.faceSets.length) {
            this.faceSetIndex = 1;
        }
    }
    
    EnemyCollection.prototype.randomFaceSet = function() {
        this.faceSetIndex = Math.floor(Math.random() * this.faceSets.length);
    }    
    
    EnemyCollection.prototype.createRank = function(rank) {
        var currentRow = 0;
        var currentColumn = 0;
        
        var totalWidth  = (this.widthEnemy * this.columns) + (this.widthMargin * (this.columns - 2));
        var totalHeight = (this.heightEnemy * this.rows) + (this.heightMargin * (this.rows - 2));
        
        var xOffset = -totalWidth / 2; //left-most point in grid
        var yOffset = -totalHeight / 2; //top-most point in grid
        var zOffset = -750 * rank; 
        var rotateSpeed = 10 / (rank + 1);
          
        var numEnemies = this.columns * this.rows;
        for (var i = 0; i < numEnemies; i++) {
            var x = xOffset + currentColumn * (this.widthEnemy + this.widthMargin);
            var y = yOffset + currentRow * (this.heightEnemy + this.heightMargin);
            var z = zOffset;
            
            var position = new THREE.Vector3(x, y, z);
            
            var faceSet = this.getCurrentFaceSet();
            var faceImageIndex = Math.floor(Math.random() * faceSet.imageAssets.length);
            var faceImage = faceSet.imageAssets[faceImageIndex].data;
            var faceImageComposite = this.createCompositeImage([this.faceBackImage, faceImage, this.faceForeImage]);
            
            var enemy = new Enemy(i, this.sideImage, faceImageComposite, this.dieAudio, position, this.widthEnemy, this.heightEnemy, this.heightEnemy, rotateSpeed);

            enemy.setExplosionCollection(this.explosionCollection);
            enemy.setScore(this.score);
            enemy.addTo(this.enemyGroup);
            
            currentColumn++;
            if (currentColumn >= this.columns) {
                currentColumn = 0;
                currentRow++;
            }
        }  
    }
    
    EnemyCollection.prototype.addTo = function(parent) {
        parent.add(this.enemyGroup);
    }
    
    //////////////////////////////////////////////////////////////////////
	// setters
    //////////////////////////////////////////////////////////////////////
    
    EnemyCollection.prototype.setExplosionCollection = function(explosionCollection) {
        this.explosionCollection = explosionCollection;
    }
    
    EnemyCollection.prototype.setScore = function(score) {
        this.score = score;
    }
    
    EnemyCollection.prototype.onEnableVideo = function() {
        this.videoEnabled = true;
        this.setTexture();
    }

    EnemyCollection.prototype.onDisableVideo = function() {
        this.videoEnabled = false;
        this.setTexture();
    }   

    EnemyCollection.prototype.onUpdateVideo = function() {
        var length = this.enemyGroup.children.length;
        for (var i=0; i < length; i++) {
            this.enemyGroup.children[i].objectRef.updateTexture();
        }
    }
    
    EnemyCollection.prototype.setTexture = function() {
        var length = this.enemyGroup.children.length;
        for (var i=0; i < length; i++) {
            var enemy = this.enemyGroup.children[i].objectRef;
            
            var texture;
            if (this.videoEnabled) {
                texture = this.videoCanvasElement;
            } else {
                texture = enemy.getFaceImage();
            }
            enemy.setTexture(texture); 
        }
    }

    EnemyCollection.prototype.setPosition = function() {
        // perform boundary checks
        if (this.enemyGroup.position.x > BOUND_X) {
            this.enemyGroup.position.x = BOUND_X;
            this.hitEdgeX();
        } else if (this.enemyGroup.position.x < -BOUND_X) {
            this.enemyGroup.position.x = -BOUND_X;
            this.hitEdgeX();
        }
        
        var enemyGroupLength = this.enemyGroup.children.length;
        for (var i=0; i < enemyGroupLength; i++) {
            this.enemyGroup.children[i].objectRef.setPosition(this.enemyGroup.position);
        }
    }

    EnemyCollection.prototype.hitEdgeX = function() {
        var hitEdgeZ = false;
        this.velocity.x = -this.velocity.x;

        var enemyGroupLength = this.enemyGroup.children.length;
        for (var i=0; i < enemyGroupLength; i++) {
            var enemy = this.enemyGroup.children[i].objectRef;
            enemy.targetPosition.z += this.velocity.z;
            
            if (
                (enemy.targetPosition.z >= 500 && this.velocity.z > 0) || 
                (enemy.targetPosition.z <= -BOUND_Z && this.velocity.z < 0)) {
                hitEdgeZ = true;
            }
        }
        
        // change direction
        if (hitEdgeZ) {
            this.hitEdgeZ();
        }
    }
    
    EnemyCollection.prototype.hitEdgeZ = function() {
        this.velocity.z = -this.velocity.z;
    }    
         
	//////////////////////////////////////////////////////////////////////
	// update / render
    //////////////////////////////////////////////////////////////////////
 
    EnemyCollection.prototype.update = function(elapsed) {
        this.enemyGroup.position.x += this.velocity.x * elapsed;
        this.setPosition();
        
        // update enemies
        var enemyGroupLength = this.enemyGroup.children.length;
        for (var i=0; i < enemyGroupLength; i++) {
            this.enemyGroup.children[i].objectRef.update(elapsed);
        }
        
        // remove inactive enemies
        for (var i=0; i < this.enemyGroup.children.length; i++) {
            var enemy = this.enemyGroup.children[i];
            
            if (!enemy.objectRef.active) {
                this.enemyGroup.remove(enemy);
                i--;
            }            
        }
        
        // if last enemy was inactived, create a new wave
        if (enemyGroupLength > 0 && this.enemyGroup.children.length === 0) {
            this.resetWave(true);
        }
    }
    
    return EnemyCollection;
});