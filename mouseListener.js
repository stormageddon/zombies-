'use strict'
function initMouseListener() {
    this.clicking = false;
    this.x = null;
    this.y = null;
//    this.bounds = document.getElementById('canvas').getBoundingClientRect();

    document.addEventListener('mousedown', (e) => {
        this.clicking = true;
        this.x = e.clientX;
        this.y = e.clientY;
    });

    document.addEventListener('mouseup', (e) => {
        this.clicking = false;
        this.x = null;
        this.y = null;
    });

    document.addEventListener('mousemove', (e) => {
        if (this.clicking) {
            this.x = e.clientX;
            this.y = e.clientY;
        }

    });

}

module.exports = initMouseListener;