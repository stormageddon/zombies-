class Enemy {
    constructor(width, height, x, y, ctx) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
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
            this.x++;
        }
        else if (this.x > destX) {
            this.x--;
        }

        if (this.y < destY) {
            this.y++;
        }
        else if (this.y > destY) {
            this.y--;
        }
    }
}

module.exports = {
    Enemy: Enemy, 
    SimpleEnemy: SimpleEnemy
}