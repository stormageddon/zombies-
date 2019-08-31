'use strict'
const GameColor = require('./color.js').GameColor;

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;  
    }

    tick() {}
    render() {}
    getBounds() {}
    consume() {}
}

class HealthKit extends GameObject {
    constructor(x, y, ctx) {
        super(x,y);
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.ctx = ctx;
        this.color = new GameColor(0,155,0);
    }

    tick() {}
    render() {
        this.ctx.fillStyle = this.color.getRGBString();
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    consume(target) {
        target.health += 5;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            r: 0
        }
    }
}

class Bullet extends GameObject {
    constructor(width, height, x, y, ctx, destX, destY, color, targetsEnemy) {
        super(x,y);
        this.x = x; 
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.destX = destX;
        this.destY = destY;
        this.speed = 2;
        this.distanceToTravel = 1200 * 0.4;
        this.distanceTravelled = 0;
        this.radius = 1;
        this.color = color;
        this.targetsEnemy = targetsEnemy;

        let r = Math.atan2(this.destY-this.y, this.destX-this.x);

        this.velY = Math.sin(r) * this.speed; 
        this.velX =  Math.cos(r) * this.speed;
    }
    

    tick() {

        // move towards enemy

        let prevX = this.x;
        let prevY = this.y;

        this.x += this.velX;
        this.y += this.velY;

        this.distanceTravelled += (Math.abs(this.y - prevY) + Math.abs(this.x - prevX));
    }

    render() {
        this.ctx.fillStyle = this.color.getRGBString();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false);

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
}


class Punch extends GameObject {
    constructor(width, height, x, y, ctx, destX, destY, color, targetsEnemy) {
        super(x,y);
        this.x = x; 
        this.y = y;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.destX = destX;
        this.destY = destY;
        this.speed = 2;
        this.distanceToTravel = 32 / 2 + 10
        this.distanceTravelled = 0;
        this.radius = 1;
        this.color = color;
        this.targetsEnemy = targetsEnemy;

        let r = Math.atan2(this.destY-this.y, this.destX-this.x);

        this.velY = Math.sin(r) * this.speed; 
        this.velX =  Math.cos(r) * this.speed;
    }


    tick() {

        // move towards enemy
    
        let prevX = this.x;
        let prevY = this.y;
    
        this.x += this.velX;
        this.y += this.velY;
    
        this.distanceTravelled += (Math.abs(this.y - prevY) + Math.abs(this.x - prevX));
    }
    
    render() {
        this.ctx.fillStyle = this.color.getRGBString();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false);
    
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

module.exports = {
    GameObject: GameObject,
    Bullet: Bullet,
    Punch: Punch,
    HealthKit: HealthKit
}