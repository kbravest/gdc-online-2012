/**
 * @fileOverview
 * Game Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
    'stage',
    'input/input',
    'score',
    'lib/events',
    'audio-manager',
    'collision-resolver',
    'gameobjects/webcam',
    'gameobjects/camera',
    'gameobjects/ship',
    'gameobjects/enemy-collection',
    'gameobjects/projectile-collection',
    'gameobjects/explosion-collection',
    'gameobjects/light',
    'gameobjects/starfield',
    'gameobjects/nebula',
    'lib-thirdparty/three'
    ], 
    function(
        Stage,
        Input,
        Score,
        Events,
        AudioManager,
        CollisionResolver,
        Webcam,
        Camera,
        Ship, 
        EnemyCollection,
        ProjectileCollection,
        ExplosionCollection,
        Light,
        Starfield,
        Nebula
    ) {
     
    "use strict"; 
   
    var Game = function() {
        ////////////////////////////////////////////
        // Create stage object
        ////////////////////////////////////////////
        this.stage = new Stage(document.getElementById('scene'), document.getElementById('container'), 1024, 768); 

        ////////////////////////////////////////////
        // Initialize input listeners
        ////////////////////////////////////////////
        this.input = new Input(this.stage);
        
        // scene
        this.renderables = null;
   
        // assets
        this.imageAssets = {};
        this.audioAssets = {};
        this.geometries = {};
        
        // game objects
        this.score = null;
        this.camera = null;
        this.enemyCollection = null;
        this.projectileCollection = null;
        this.explosionCollection = null;
        this.ship = null;
        this.light = null;
        this.webcam = null;
        this.starfield = null;

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        document.getElementById('three-container').appendChild(this.renderer.domElement);
        this.renderer.setSize(this.stage.width, this.stage.height);

        this.canvas = document.getElementById('two-canvas');
        this.canvas.width = this.stage.width;
        this.canvas.height = this.stage.height;
        this.context = this.canvas.getContext('2d');
        
        this.audioContext = new webkitAudioContext();  
        
        // game loop variables
		this.prevTime = null;
        this.stepFn = this.step.bind(this); // in-context function reference for gc purposes;
        this.isPaused = false;
        
        // ensure clicks of links do not forward to any url
        $('#console a').on('click', function(e) {
            e.preventDefault();
            return false;
        });        

        var self = this;
        $.when(
            this.startPressed(),
            this.loadImages(), 
            this.loadAudio(), 
            this.loadGeometries()
        )
            .done(function() {
                self.createScene();
            });
    }
    
   	//////////////////////////////////////////////////////////////////////
	// preload
    //////////////////////////////////////////////////////////////////////
   
    Game.prototype.startPressed = function() {
        var deferred = new $.Deferred();
        
        $('#start-button').on('click', function() {
            deferred.resolve();
        });
        
        //quick 'n dirty check for query param
        if (window.location.href.indexOf('skiptitle') > 0) {
            deferred.resolve();        
        }        
        return deferred.promise();
    }
        
    /**
     * Preload a set of image files and cache results into this.imageAssets for later use
     */
    Game.prototype.loadImages = function() {
        var deferred = new $.Deferred();
        
        this.imageAssets = {
            enemySide:  { src: 'assets/images/enemy/enemy-side.jpg' },
            enemyFaceFore: { src: 'assets/images/enemy/enemy-face-fore.png'  },
            enemyFaceBack: { src: 'assets/images/enemy/enemy-face-back.jpg'  },
            nebula:     { src: 'assets/images/nebula/nebula0.png'},
            explosion:  { src: 'assets/images/projectile/explosion.png' },
            projectile: { src: 'assets/images/projectile/projectile.png' }
        };
        
        this.enemyFaceSets = [
            { folder: 'enemy-face-set-0', count: 1, imageAssets: [] },
            { folder: 'enemy-face-set-1', count: 6, imageAssets: [] },
            { folder: 'enemy-face-set-2', count: 5, imageAssets: [] },
            { folder: 'enemy-face-set-3', count: 6, imageAssets: [] }
        ];
        
        for (var i = 0; i < this.enemyFaceSets.length; i++) {
            var folder = this.enemyFaceSets[i].folder;
            var count = this.enemyFaceSets[i].count;

            for (var j=0; j < count; j++) {
                var id = 'enemyFaceSet_' + i + '_' + j;
                var src = 'assets/images/' + folder + '/enemy-face-' + j + '.png';
                var image = { src: src };
                this.imageAssets[id] = image;
                this.enemyFaceSets[i].imageAssets.push(image);
            }
        }
        
        this.imagesAssetsLoaded = 0;
        this.imageAssetsLength = 0;
        for (var i in this.imageAssets) {
            if (this.imageAssets.hasOwnProperty(i)) {
                this.imageAssetsLength++;
            }
        }

        var cacheBuster = 'cb=' + (new Date()).getTime();
        
        var self = this;
        for (var i in this.imageAssets) {
            if (this.imageAssets.hasOwnProperty(i)) {
                var image = this.imageAssets[i];
                var src = image.src + '?cb=' + cacheBuster;
                
                image.data = new Image();
                image.data.onload = function() {
                    self.imagesAssetsLoaded++;
                    
                    if (self.imagesAssetsLoaded === self.imageAssetsLength) {
                        deferred.resolve();
                    }
                }
                image.data.src = src;
            }
        }
        
        return deferred.promise();
    }
    
    /**
     * Preload a set of audio files and cache results into this.audio for later use
     */
    Game.prototype.loadAudio = function() {
        var deferred = new $.Deferred();
        
        var audioArray = [
            {id:'shipAmbient', src:'assets/audio/ship-ambient.mp3'},
            {id:'explosion-big', src:'assets/audio/explosion-big.mp3'},
            {id:'explosion-small', src:'assets/audio/explosion-small.mp3'},
            {id:'projectile', src:'assets/audio/projectile.mp3'}
        ];
        
        this.audioLoaded = 0;
        this.audioCount = audioArray.length;
        
        var cacheBuster = 'cb=' + (new Date()).getTime();
        
        var self = this;
        for (var i = 0; i < audioArray.length; i++) {
            var id = audioArray[i].id;
            var src = audioArray[i].src + '?cb=' + cacheBuster;
            
            // must use XMLHttpRequest here with arraybuffer response type in order to load in binary audio data
            var request = new XMLHttpRequest();
            request.open('GET', src, true);
            request.responseType = 'arraybuffer';
            request.id = id;

            request.onload = function() {
                self.audioLoaded++;
                self.audioAssets[this.id] = new AudioManager(self.audioContext, this.response);
                
                if (self.audioLoaded === self.audioCount) {
                    deferred.resolve();
                }
            }

            request.send();
        }
        
        return deferred.promise();
    }
        
    Game.prototype.loadGeometries = function() {
        var deferred = new $.Deferred();
    
        var self = this;
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load( 
            'assets/geometries/ship-geometry.js', 
            function( geometry ) {
                self.geometries['ship'] = geometry;
                deferred.resolve();
            }
        );
        
        return deferred.promise();
    }    
    
	//////////////////////////////////////////////////////////////////////
	// scene creation
    //////////////////////////////////////////////////////////////////////

    Game.prototype.createScene = function() {
        $('#container > section').removeClass('active');
        $('#container > section#game').addClass('active');
            
        this.createRenderables();
        this.start();
    }
	
	Game.prototype.createRenderables = function() {    
		// construct game objects
        this.score = new Score(
           document.getElementById('score-value')
        );
        
		this.camera = new Camera(
            this.stage.width, 
            this.stage.height, 
            this.input.state
        );
        
        this.ship = new Ship(
            this.geometries['ship'], 
            this.audioAssets['shipAmbient'], 
            this.input.state
        );   
                
        this.enemyCollection = new EnemyCollection(
            this.enemyFaceSets, 
            this.imageAssets['enemySide'].data,
            this.imageAssets['enemyFaceFore'].data,
            this.imageAssets['enemyFaceBack'].data,
            this.audioAssets['explosion-big'],
            document.getElementById('enemy-face-video')
        );
        
        this.projectileCollection = new ProjectileCollection(
            this.imageAssets['projectile'].data, 
            this.audioAssets['projectile']
        );
        
        this.explosionCollection = new ExplosionCollection(
            this.imageAssets['explosion'].data,
            this.audioAssets['explosion-small']
        );
        
        this.light = new Light();
        
        this.starfield = new Starfield();
        
        this.nebula = new Nebula(
            this.imageAssets['nebula'].data, 
            this.input.state
        );
        
        this.webcam = new Webcam(
            this.imageAssets['enemyFaceFore'].data,
            document.getElementById('webcam-video'), 
            document.getElementById('enemy-face-video')
        );
        
        this.collisionResolver = new CollisionResolver();
        
        // set game object relationships
        this.ship.setProjectile(this.projectileCollection);        
        this.enemyCollection.setExplosionCollection(this.explosionCollection);
        this.camera.setEnemyCollection(this.enemyCollection);
        this.enemyCollection.setScore(this.score);
        
        // set collidables
        this.collisionResolver.setProjectileCollidables(this.projectileCollection.projectileGroup.children);
        this.collisionResolver.setEnemyCollidables(this.enemyCollection.enemyGroup.children);
        
        // create renderables
        this.renderables = new THREE.Scene();
        this.ship.addTo(this.renderables);
        this.camera.addTo(this.renderables);
        this.light.addTo(this.renderables);
        this.enemyCollection.addTo(this.renderables);
        this.projectileCollection.addTo(this.renderables);
        this.explosionCollection.addTo(this.renderables);
        this.starfield.addTo(this.renderables);
        this.nebula.addTo(this.renderables);
 	}

    //////////////////////////////////////////////////////////////////////
	// event handlers
    //////////////////////////////////////////////////////////////////////
	
	Game.prototype.bindEvents = function() {
		this.camera.bindEvents();
        this.webcam.bindEvents();
	}
	
	Game.prototype.unbindEvents = function() {
		this.camera.unbindEvents();
        this.webcam.unbindEvents();
	}

	//////////////////////////////////////////////////////////////////////
	// game loop
    //////////////////////////////////////////////////////////////////////

    Game.prototype.pause = function() {
		if (!this.isPaused) {
			this.isPaused = true;
			this.stop();
		}
    },

    Game.prototype.resume = function() {
        if (this.isPaused) {
            this.isPaused = false;
            this.start();
        }
    },
	
	Game.prototype.start = function() {
        // init user interaction
		this.unbindEvents();
		this.bindEvents(); 
        
        //kick off game loop
		this.prevTime = performance.now();
        this.step();
    },
	
	Game.prototype.stop = function() {
		this.unbindEvents();
    },	

    // game loop
    Game.prototype.step = function(currentTime) {
        if (!this.isPaused) {
            this.requestAnimationFrameId = requestAnimationFrame(this.stepFn);
            this.update(currentTime);
            this.render();
        }
    },

    // update game logic
    Game.prototype.update = function(currentTime) {	
		if (currentTime == null) { 
			currentTime = this.prevTime; 
		}
		var elapsed = currentTime - this.prevTime;
		this.prevTime = currentTime;
        
        // update game objects
        this.input.update();
        this.camera.update(elapsed);
        this.ship.update(elapsed);
        this.enemyCollection.update(elapsed);
        this.projectileCollection.update(elapsed);
        this.explosionCollection.update(elapsed);
        this.starfield.update(elapsed);
        this.nebula.update(elapsed);
        this.webcam.update(elapsed);
        this.collisionResolver.update(elapsed);
        this.score.update(elapsed)
    }
    
    Game.prototype.render = function() {
        // render 3D game objects
        this.renderer.render(this.renderables, this.camera.mesh);
        
        // render 2D game objects
        if (this.webcam.isDirty) {
            this.webcam.render();
        }
    }
    
    return Game;   
});