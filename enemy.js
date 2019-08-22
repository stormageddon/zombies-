class Enemy {
    constructor(width, height, x, y, attackRadius, ctx) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.speed = 0.5;
        this.attackRadius = attackRadius;
        this.damage = 1;
    }

    tick(destX, destY) {
        
    }

    render() {
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fillRect(this.x,this.y,this.width,this.height);

        this.ctx.fillStyle = 'rgba(255,0,0,0.3)';
        this.ctx.fillRect(this.x - this.attackRadius / 2, this.y - this.attackRadius / 2, this.attackRadius + this.width, this.attackRadius + this.height);
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            r: this.attackRadius
        }
    }

    attack(player) {
        player.health -= this.damage;
    }
}

class SimpleEnemy extends Enemy {
    constructor(width, height, x, y, attackRadius, ctx) {
        super(width, height, x, y, attackRadius, ctx);
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