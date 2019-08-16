class Player {
    constructor(width, height, x, y, ctx, game) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.xVelocity = 1;
        this.yVelocity = 1;
        this.ctx = ctx;
        this.game = game;
    }

    tick() {
        this.x += this.xVelocity;
        if (this.x > this.game.width - this.width) {
            this.x = 0;
        }
    }

    render() {
        this.ctx.fillStyle = 'rgb(100,100,100)';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// export function Player() {
//     this.Player = Player
// }