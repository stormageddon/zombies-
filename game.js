'use strict'

//import Player from './player.js';

//console.log(Player);
let movement = {
    left: false,
    right: false,
    up: false,
    down: false
}

document.addEventListener("keydown", (e) => {
    console.log('pressed: ' + e.code);
    switch (e.code) {
        case 'KeyW':
            game.player.yVelocity = -game.player.speed;
            movement.up = true;
            break;
        case 'KeyS':
            game.player.yVelocity = game.player.speed;
            movement.down = true;
            break;
        case 'KeyA':
            game.player.xVelocity = -game.player.speed;
            movement.left = true;
            break;
        case 'KeyD':
            game.player.xVelocity = game.player.speed;
            movement.right = true;
            break;
    }

    if (movement.up) {
        
    }
});

document.addEventListener("keyup", (e) => {
    console.log(e.code);
    switch (e.code) {
        case 'KeyW':
            movement.up = false;
            break;
        case 'KeyS':
            movement.down = false;
            break;
        case 'KeyA':
            movement.left = false;
            break;
        case 'KeyD':
            movement.right = false;
            break;
    }

    if (!movement.up && !movement.down) game.player.yVelocity = 0;
    if (!movement.left && !movement.right) game.player.xVelocity = 0;


});

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
        if (this.y > this.game.width - this.width) {
            this.y = this.game.width - this.width;
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

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.isRunning = true;
        this.tickSpeed = 1;        

        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);


        this.ctx = document.getElementById('canvas').getContext("2d")
        this.player = new Player(32, 32, 0, 0, this.ctx, this);
    }   

    start() {
        // this.ctx.fillStyle = "rgb(255,255,255)";
        // this.ctx.font = "100px Arial";
        // const title = 'Zombies!'
        // this.ctx.fillText(title, this.width / 2 - 200, this.height / 2);

        // setTimeout(x => {
            
        // }, 3000);

        setInterval(this.tick.bind(this), 5);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop() {
        this.render();    
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }    
    }

    tick() {
        this.player.tick();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.render();
    }
}




let count = 10;
//const game = new Game(1200, 800);
const game = new Game(600, 600);
//game.start();
//function 

game.start();

