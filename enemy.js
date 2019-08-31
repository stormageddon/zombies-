const Punch = require('./gameObject.js').Punch;
const GameColor = require('./color.js').GameColor
const HealthKit = require('./gameObject.js').HealthKit;


class Enemy {
    constructor(width, height, x, y, attackRadius, ctx, doFire) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.speed = 0.5;
        this.attackRadius = attackRadius;
        this.damage = 1;
        this.doFire = doFire;
        this.attackTimer = 2.0;
    }

    tick(destX, destY) {
        
    }

    render() {
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            r: this.attackRadius
        }
    }

    attack(player) {
        this.doFire(player.x,
            player.y, 
            new Punch(1,1,this.x + (this.width / 2), this.y + (this.height/ 2), this.ctx, player.x, player.y, new GameColor(255,0,0), false)
        )
        this.attackTimer = 2.0
    }

    kill() {
        // Drop loot
        let r = Math.random()
        if (r > 0.6) {
            console.log("drop health kit");
            return new HealthKit(this.x, this.y, this.ctx);
        }
    }
}

class SimpleEnemy extends Enemy {
    constructor(width, height, x, y, attackRadius, ctx, doFire) {
        super(width, height, x, y, attackRadius, ctx, doFire);
    }

    tick(destX, destY) {
        if (!this.canAttack) {
            // move towards player in stupid fashion
            if (this.x < destX) {
                this.x += this.speed;
            }
            else if (this.x > destX) {
                this.x -= this.speed;
            }

            if (this.y < destY) {
                this.y += this.speed;
            }
            else if (this.y > destY) {
                this.y -= this.speed;
            }
        } 
    }
}

class FastEnemy extends SimpleEnemy {
    constructor(width, height, x, y, ctx) {
        super(width, height, x, y, ctx);
        this.speed = 1.0
    }

    render() {

        this.ctx.fillStyle = 'rgb(0,255,0)';
        this.ctx.fillRect(this.x,this.y,this.width,this.height);

    }
}


module.exports = {
    Enemy: Enemy, 
    SimpleEnemy: SimpleEnemy,
    FastEnemy: FastEnemy
}