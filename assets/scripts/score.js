/**
 * @fileOverview
 * Score Class File
 *
 * @author Kevin Moot <kmoot@nerdery.com>
 * @version 1.0
 */

define([
    ], 
    function(
    ) {
    
    "use strict";

    var Score = function(scoreTextContainer) {
        this.consoleContainer = $('#console');
        this.scoreContainer = $('#console #score');
        this.scoreTextContainer = scoreTextContainer;
        this.score = null;
        
        this.elapsed = 0;
        this.width = 379;
        this.halfWidth = this.width / 2;
        this.rotationDegrees = -45;
        this.y = -200;
        
        this.setTranslation();
        this.setRotation();
        
        this.set(0);
    }
    
    Score.prototype.increment = function(value) {
        this.score += value;
        this.render();
    }
    
    Score.prototype.set = function(value) {
        this.score = value;
        this.render();
    }
    
    Score.prototype.render = function() {
        $(this.scoreTextContainer).text(this.score);
    }
    
    // quick n' dirty intro animation for score panel
    Score.prototype.update = function(elapsed) {
        this.elapsed += elapsed;
        
        if (this.elapsed > 5500) {
            if (this.y < 0) {
                this.y += 10;
                this.setTranslation();
            }
            else if (this.y > 0) {
                this.y = 0;
                this.setTranslation();
            }
        }
        
        if (this.elapsed > 6000) {
            if (this.rotationDegrees < 0) {
                this.rotationDegrees += 5;
                this.setRotation();
            }
            else if (this.rotationDegrees > 0) {
                this.rotationDegrees = 0;
                this.setRotation();
            }
        }
    }
    
    Score.prototype.setTranslation = function() {
        this.consoleContainer.css('WebkitTransform', 'translate(0px, ' + this.y + 'px)');
    }
    
    Score.prototype.setRotation = function() {
        this.scoreContainer.css('WebkitTransform', 'translate(-' + this.halfWidth + 'px, 0px) rotate(' + this.rotationDegrees + 'deg) translate(' + this.halfWidth + 'px, 0px)');
    }
    
    return Score;
});