// to bundle:
// browserify player.js keyListener.js enemy.js game.js > dist/bundle.js

'use strict'
const Player = require('./player.js');
const Enemy = require('./enemy.js').Enemy;
const SimpleEnemy = require('./enemy.js').SimpleEnemy;
const FastEnemy = require('./enemy.js').FastEnemy;
const GameObject = require('./gameObject.js').GameObject;
const Bullet = require('./gameObject.js').Bullet;
const Punch = require('./gameObject.js').Punch;
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 650;
const GameColor = require('./color.js').GameColor

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
       
                
        this.bullets = []
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

        if (this.mouseListener.clicking && this.fireTimer == 0) {
            this.doFire(
                this.mouseListener.x, 
                this.mouseListener.y,
                new Bullet(1,1,this.player.x + (this.player.width / 2), this.player.y + (this.player.height/ 2), this.ctx, this.mouseListener.x, this.mouseListener.y, new GameColor(255,0,0), true)
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
            

            //f (RectA.X1 < RectB.X2 && RectA.X2 > RectB.X1 &&
            //    RectA.Y1 > RectB.Y2 && RectA.Y2 < RectB.Y1) 
            if (this.inRange(this.player, enemy) && enemy.attackTimer <= 0) {
                //this.player.health -= 1 
                //this.enemies.splice(i, 1);
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

    inRange(target, attacker) {
        // debugger;
        let attackerX = attacker.getBounds().x;
        let attackerY = attacker.getBounds().y;
        let attackerR = attacker.getBounds().r;



        let one =  attackerX - attackerR / 2
        let three = attackerX  + attackerR / 2 + attacker.width
        let two = attackerY - attackerR / 2
        let four = attackerY + attackerR / 2


        this.ctx.fillStyle = "rgba(0,0,255,0.2)"
        this.ctx.fillRect(one, two, three, four)
        

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
        console.log("START")
        // this.generateEnemies();
        this.gameEnded = false;
        setInterval(this.tick.bind(this), 5);
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    doFire(destX, destY, attackObject) {
        let c = new GameColor()
        //this.bullets.push(new Punch(1,1,this.player.x + (this.player.width / 2), this.player.y + (this.player.height/ 2), this.ctx, destX, destY, new GameColor(0,0,255)));
        this.bullets.push(attackObject)
    }

    generateEnemies() {
        let self = this;
        for (let i = 0; i < 5 + (2 * this.level); i++) {
            this.enemies.push(new SimpleEnemy(32, 32, Math.random() * this.width, Math.random() * this.height, 32, this.ctx, this.doFire.bind(this)));
        }
    }
}



let count = 10;
window.game = new Game(GAME_WIDTH, GAME_HEIGHT);

game.start();

