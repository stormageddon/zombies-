class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    tick() {
        console.log("override in subclass");
    }

    render() {
        console.log("override in subclass");
    }
}

class Bullet extends GameObject {
    constructor(width, height, x, y, ctx, destX, destY) {
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

        // this.dx = this.destX - this.x;
        // this.dy = this.destY - this.y;

        let r = Math.atan2(this.destY-this.y, this.destX-this.x);
        console.log(r);

        this.velY = Math.sin(r) * this.speed; 
        this.velX =  Math.cos(r) * this.speed;


        // var dist = Math.sqrt(vx * vx + vy * vy);
        // this.dx = vx / dist;
        // this.dy = vy / dist;
        // this.dx *= this.speed;
        // this.dy *= this.speed;


        console.log(`(${this.velX}, ${this.velY})`);

        // this.dirX = Math.abs(this.destX - this.x);
        // this.dirY = Math.abs(this.destY - this.y);
        // this.len = Math.sqrt(Math.pow(this.dirX, 2) + Math.pow(this.dirY, 2));
        
        // this.dirX /= this.len;
        // this.dirY /= this.len;


        // this.dir = Math.atan2(this.destY - this.y, this.destX - this.x);
        // this.dx = Math.cos(this.dir) * this.speed;
        // this.dy = Math.sin(this.dir) * this.speed;

        // console.log('destX: ' + this.destX);
        // console.log('destY: ' + this.destY);


    }

    tick() {

        // move towards enemy
        /*if (this.x < this.destX) {
            this.x += this.speed * this.dirX;
        }
        else if (this.x > this.destX) {
            this.x -= this.speed * this.dirX;
        }

        if (this.y < this.destY) {
            this.y += this.speed * this.dirY;
        }
        else if (this.y > this.destY) {
            this.y -= this.speed * this.dirY;
        }

        if (this.x == this.destX && this.y == this.destY) {
            delete this;
        }

        this.life--;
*/
//        console.log('dx: ' + this.dx);
//        console.log('dy: ' + this.dy);

        this.x += this.velX;
        this.y += this.velY;

        this.distanceTravelled += this.velX;
    }

    render() {
        this.ctx.fillStyle = 'rgb(0,0,255)';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false);

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

module.exports = {
    GameObject: GameObject,
    Bullet: Bullet
}