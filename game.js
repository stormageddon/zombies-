// to bundle:
// browserify player.js keyListener.js game.js > dist/bundle.js

'use strict'
let Player = require('./player.js')


//import Player from './player.js';

//console.log(Player);
window.movement = {
    left: false,
    right: false,
    up: false,
    down: false
}

require('./keyListener.js')


// document.addEventListener("keyup", (e) => {
//     console.log(e.code);
//     switch (e.code) {
//         case 'KeyW':
//             movement.up = false;
//             break;
//         case 'KeyS':
//             movement.down = false;
//             break;
//         case 'KeyA':
//             movement.left = false;
//             break;
//         case 'KeyD':
//             movement.right = false;
//             break;
//     }

//     if (!movement.up && !movement.down) game.player.yVelocity = 0;
//     if (!movement.left && !movement.right) game.player.xVelocity = 0;


// });

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
window.game = new Game(1200, 650);

game.start();

