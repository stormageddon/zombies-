'use strict'

const Player = require('./player.js');
const SimpleEnemy = require('./enemy.js').SimpleEnemy;
const FastEnemy = require('./enemy.js').FastEnemy;
const Bullet = require('./gameObject.js').Bullet;
const Punch = require('./gameObject.js').Punch;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;
const GameColor = require('./color.js').GameColor;

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
        this.level = 1; 
        this.gameEnded = false;
        this.score = 0;

        const canvas = document.getElementById('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);


        this.ctx = document.getElementById('canvas').getContext("2d")
        
        this.player = new Player(32, 32, 0, 0, this.ctx, this);
        this.enemies = []
       
                
        this.bullets = []
        this.gameObjects = []
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

        if (this.enemies.length == 0) {
            this.generateEnemies();
        }

        this.player.tick();

        for (let i = this.gameObjects.length; i--; i >= 0) {
            let go = this.gameObjects[i];

            if (this.intersectRect(go, this.player)) {
                go.consume(this.player);
                this.gameObjects.splice(i, 1);
            }
        }

        if (this.mouseListener.clicking && this.fireTimer == 0) {
            this.doFire(
                this.mouseListener.x, 
                this.mouseListener.y,
                new Punch(1,1,this.player.x + (this.player.width / 2), this.player.y + (this.player.height/ 2), this.ctx, this.mouseListener.x, this.mouseListener.y, new GameColor(255,0,0), true)
            );

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

            if (this.inRange(this.player, enemy) && enemy.attackTimer <= 0) {
                enemy.canAttack = true;
                enemy.attack(this.player);
            }
            else {
                enemy.canAttack = false;
                enemy.attackTimer -= 0.1;
            }

            enemy.tick(this.player.x, this.player.y);
        }

        for(let i = this.bullets.length; i--; i >= 0) {
            let bullet = this.bullets[i];
            bullet.tick();

             // check for end of range
             if (Math.abs(bullet.distanceTravelled) >= bullet.distanceToTravel) {
                this.bullets.splice(i, 1);
            }

            // check for enemy collision
            for (let j = this.enemies.length; j--; j >= 0) {
                let enemy = this.enemies[j];
                if (bullet.targetsEnemy && (bullet.x >= enemy.x && bullet.x < enemy.x + enemy.width)) {
                    if (bullet.y >= enemy.y && bullet.y < enemy.y + enemy.height) {
                        let loot = enemy.kill();
                        if (loot) this.gameObjects.push(loot);
                        this.score += enemy.value;
                        this.enemies.splice(j, 1);
                        this.bullets.splice(i, 1);
                        if (this.enemies.length == 0) {
                            this.level++;
                            this.generateEnemies();
                        }

                        break;
                    }
                } else if (!bullet.targetsEnemy && (bullet.x >= this.player.x && bullet.x < this.player.x + enemy.width)) {
                    if (bullet.y >= this.player.y && bullet.y < this.player.y + this.player.height) {
                        this.player.health -= 1;
                        this.bullets.splice(i, 1);
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

        for (let enemy of this.enemies) {
            enemy.render();
        }

        for(let bullet of this.bullets) {
            bullet.render();
        }

        for(let go of this.gameObjects) {
            go.render();
        }

        this.renderHealthbar();
        this.renderScore();

    }

    renderHealthbar() {
        this.ctx.fillStyle = "rgb(155,0,0)";
        this.ctx.fillRect(10,10,100,20);

        this.ctx.fillStyle = "green";
        this.ctx.fillRect(10,10,this.player.health, 20);
    }

    renderScore() {
        this.ctx.fillStyle = "white"
        this.ctx.font = "14px Arial";
        let text = 'Level: ' + this.level;
        this.ctx.fillText(text, this.width - 100, 20);
        
        text = 'Score: ' + this.score;
        this.ctx.fillText(text, this.width - 100, 40);
    }

    gameOver() {
        this.ctx.clearRect(0, 0, this.width, this.height);
          // Draw game over screen
          this.ctx.fillStyle = "red";
          this.ctx.font = "40px Arial";
          this.ctx.fillText('Game Over!', this.width / 2 - 150, this.height / 2);
          this.gameEnded = true;
          this.isRunning = false;
    }

    inRange(target, attacker) {
        let attackerX = attacker.getBounds().x;
        let attackerY = attacker.getBounds().y;
        let attackerR = attacker.getBounds().r;

        let one =  attackerX - attackerR / 2
        let three = attackerX  + attackerR / 2 + attacker.width
        let two = attackerY - attackerR / 2
        let four = attackerY + attackerR / 2
        
        if (target.x < three
            && target.x + target.width > one 
            && target.y > two - attacker.height
            && target.y - target.height < four
        ) {
            return true;
        }

        return false;
    }
    


    start() {
        // this.ctx.fillStyle = "rgb(255,255,255)";
        // this.ctx.font = "100px Arial";
        // const title = 'Zombies!'
        // this.ctx.fillText(title, this.width / 2 - 200, this.height / 2);

        // setTimeout(x => {
            
        // }, 3000);

        // this.generateEnemies();
        this.gameEnded = false;
        setInterval(this.tick.bind(this), 5);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    doFire(destX, destY, attackObject) {
        let c = new GameColor()
        this.bullets.push(attackObject)
    }

    generateEnemies() {
        let self = this;
        for (let i = 0; i < 5 + (2 * this.level); i++) {
            this.enemies.push(new SimpleEnemy(32, 32, Math.random() * this.width, Math.random() * this.height, 32, this.ctx, this.doFire.bind(this)));
        }

        if (this.level % 3 == 0) {
            for (let i = 0; i < this.level / 3; i++) {
                this.enemies.push(new FastEnemy(32, 32, Math.random() * this.width, Math.random() * this.height, 32, this.ctx, this.doFire.bind(this)))
            }
        }
    }

    intersectRect(r1, r2) {
        return !(r2.x > r1.x + r1.width || 
                 r2.x + r2.width < r1.x || 
                 r2.y > r1.y + r1.height ||
                 r2.y + r2.height < r1.y);
      }
}

window.game = new Game(GAME_WIDTH, GAME_HEIGHT);

game.start();

