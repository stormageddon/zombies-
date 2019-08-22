class Player {
    constructor(width, height, x, y, ctx, game) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.ctx = ctx;
        this.game = game;
        this.speed = 2;
        this.health = 100;
    }

    tick() {

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        if (this.x > this.game.width - this.width) {
            this.x = 0;
        }
        if (this.x < 0) {
            this.x = this.game.width - this.width;
        }
        if (this.y > this.game.height - this.height) {
            this.y = this.game.height - this.height;
        }
        if (this.y < 0) {
            this.y = 0;
        }
    }

    render() {
        this.ctx.fillStyle = 'rgb(150,150,255)';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

module.exports = Player