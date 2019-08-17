
function init(movement) {
    document.addEventListener("keyup", (e) => {
        console.log(e.code);
        switch (e.code) {
            case 'KeyW':
                    window.movement.up = false;
                break;
            case 'KeyS':
                    window.movement.down = false;
                break;
            case 'KeyA':
                    window.movement.left = false;
                break;
            case 'KeyD':
                    window.movement.right = false;
                break;
        }
    
        if (!window.movement.up && !window.movement.down) game.player.yVelocity = 0;
        if (!window.movement.left && !window.movement.right) game.player.xVelocity = 0;
    });

    document.addEventListener("keydown", (e) => {
        console.log('pressed: ' + e.code);
        switch (e.code) {
            case 'KeyW':
                game.player.yVelocity = -game.player.speed;
                window.movement.up = true;
                break;
            case 'KeyS':
                game.player.yVelocity = game.player.speed;
                window.movement.down = true;
                break;
            case 'KeyA':
                game.player.xVelocity = -game.player.speed;
                window.movement.left = true;
                break;
            case 'KeyD':
                game.player.xVelocity = game.player.speed;
                window.movement.right = true;
                break;
        }
    
        if (window.movement.up) {
            
        }
    });
}


module.exports = init()