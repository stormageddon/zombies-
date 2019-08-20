// to bundle:
// browserify player.js keyListener.js enemy.js game.js > dist/bundle.js

'use strict'
const Player = require('./player.js');
const Enemy = require('./enemy.js').Enemy;
const SimpleEnemy = require('./enemy.js').SimpleEnemy;
const FastEnemy = require('./enemy.js').FastEnemy;
const GameObject = require('./gameObject.js').GameObject;
const Bullet = require('./gameObject.js').Bullet;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;

const FIRE_TIMER_MAX = 1.0;
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
        this.level = 0; 
        this.gameEnded = false;

        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);


        this.ctx = document.getElementById('canvas').getContext("2d")
        
        this.player = new Player(32, 32, 0, 0, this.ctx, this);
        this.enemies = []
        this.generateEnemies();
        
//        this.enemies.push(new FastEnemy(32, 32, Math.random() * this.width, Math.random() * this.height, this.ctx))
        
        this.bullets = []
    }   

    generateEnemies() {
        console.log(this.level);
        for (let i = 0; i < 5 + (2 * this.level); i++) {
            console.log('generate');
            this.enemies.push(new SimpleEnemy(32, 32, Math.random() * this.width, Math.random() * this.height, this.ctx));
        }
    }

    start() {
        // this.ctx.fillStyle = "rgb(255,255,255)";
        // this.ctx.font = "100px Arial";
        // const title = 'Zombies!'
        // this.ctx.fillText(title, this.width / 2 - 200, this.height / 2);

        // setTimeout(x => {
            
        // }, 3000);
        this.gameEnded = false;
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

        if (this.player.health <= 0) {
            this.gameOver()
        }

        if (this.gameEnded) {
            return;
        }

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

        for(let i = this.enemies.length; i--; i >= 0 ) {
            let enemy = this.enemies[i];
            enemy.tick(this.player.x, this.player.y);

            //f (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
            //    RectA.Y1 > RectB.Y2 && RectA.Y2 < RectB.Y1) 

            if (this.player.x < enemy.x + enemy.width
                && this.player.x + this.player.width > enemy.x
                && this.player.y > enemy.y - enemy.height
                && this.player.y - this.player.height < enemy.y) {
                    this.player.health--
                    this.enemies.splice(i, 1);
                    break;
            }

        }

        for(let i = this.bullets.length; i--; i >= 0) {
            let bullet = this.bullets[i];
            bullet.tick();

             // check for end of range
             if (bullet.distanceTravelled >= bullet.distanceToTravel) {
                this.bullets.splice(i, 1);
            }

            // check for enemy collision
            for (let j = this.enemies.length; j--; j >= 0) {
                let enemy = this.enemies[j];
                if (bullet.x >= enemy.x && bullet.x < enemy.x + enemy.width) {
                    if (bullet.y >= enemy.y && bullet.y < enemy.y + enemy.height) {
                        this.enemies.splice(j, 1);
                        this.bullets.splice(i, 1);
                        if (this.enemies.length == 0) {
                            this.level++;
                            this.generateEnemies();
                        }

                        break;
                    }
                } 
            }

           
        }
    }

    render() {
        if (this.gameEnded) {
            return;
        }

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.player.render();

        // Draw health
        this.ctx.fillStyle = "white";
        this.ctx.font = "10px Arial";
        this.ctx.fillText('Life: ' + this.player.health, 20, 20);

        for (let enemy of this.enemies) {
            enemy.render();
        }

        for(let bullet of this.bullets) {
            bullet.render();
        }

    }

    gameOver() {
        console.log('Game Over!');
        this.ctx.clearRect(0, 0, this.width, this.height);
          // Draw game over screen
          this.ctx.fillStyle = "red";
          this.ctx.font = "40px Arial";
          this.ctx.fillText('Game Over!', this.width / 2 - 150, this.height / 2);
          this.gameEnded = true;
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

