class Enemy {
    constructor(width, height, x, y, ctx) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.speed = 0.5;
    }

    tick(destX, destY) {
        
    }

    render() {
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class SimpleEnemy extends Enemy {
    constructor(width, height, x, y, ctx) {
        super(width, height, x, y, ctx);
    }

    tick(destX, destY) {
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