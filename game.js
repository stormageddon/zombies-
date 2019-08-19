// to bundle:
// browserify player.js keyListener.js enemy.js game.js > dist/bundle.js

'use strict'
const Player = require('./player.js');
const Enemy = require('./enemy.js').Enemy;
const SimpleEnemy = require('./enemy.js').SimpleEnemy;
const GameObject = require('./gameObject.js').GameObject;
const Bullet = require('./gameObject.js').Bullet;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;

const FIRE_TIMER_MAX = 2;
const FPS = 30;
window.movement = {
    left: false,
    right: false,
    up: false,
    down: false
}

require('./keyListener.js');
const MouseListener = require('./mouseListener.js');



class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.isRunning = true;
        this.tickSpeed = 1;  
        this.mouseListener = new MouseListener();   
        this.fireTimer = 0;   

        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);


        this.ctx = document.getElementById('canvas').getContext("2d")
        
        this.player = new Player(32, 32, 0, 0, this.ctx, this);
        this.enemies = [new SimpleEnemy(32, 32, this.width / 2, this.height / 2, this.ctx)]
        this.bullets = []
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

        if (this.mouseListener.clicking && this.fireTimer == 0) {
            this.doFire(this.mouseListener.x, this.mouseListener.y);

            this.fireTimer = FIRE_TIMER_MAX;
        }
        else {
            this.fireTimer -= 1 / FPS;
            if (this.fireTimer < 0) {
                this.fireTimer = 0;
            }
        }

/*        for(let enemy of this.enemies) {
            enemy.tick(this.player.x, this.player.y);
        }*/

        for(let i = this.bullets.length; i--; i >= 0) {
            let bullet = this.bullets[i];
            bullet.tick();
            
            // check for end of range
            if (bullet.distanceTravelled >= bullet.distanceToTravel) {
                this.bullets.splice(i, 1);
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.render();
 /*       for (let enemy of this.enemies) {
            enemy.render();
        }
*/
        for(let bullet of this.bullets) {
            bullet.render();
        }

    }

    doFire(destX, destY) {
    /*/ console.log('do fire');
        this.ctx.fillStyle = 'rgb(255,0,0)'
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + (this.player.width / 2), this.player.y + (this.player.height / 2));
        this.ctx.lineTo(destX, destY);
        this.ctx.stroke();*/
        this.bullets.push(new Bullet(1,1,this.player.x + (this.player.width / 2), this.player.y + (this.player.height/ 2), this.ctx, destX, destY));
        console.log(this.bullets);
    }
}

let count = 10;
window.game = new Game(GAME_WIDTH, GAME_HEIGHT);

game.start();

