function initMouseListener() {
    this.clicking = false;
    this.x = null;
    this.y = null;
//    this.bounds = document.getElementById('canvas').getBoundingClientRect();

    document.addEventListener('mousedown', (e) => {
        console.log(`(${e.clientX},${e.clientY})`);
        this.clicking = true;
        this.x = e.clientX;
        this.y = e.clientY;

        // this.x = (e.clientX - this.bounds.left) / (this.bounds.right - this.bounds.left) * document.getElementById('canvas').width
        // this.y = (e.clientY - this.bounds.top) / (this.bounds.bottom - this.bounds.top) * document.getElementById('canvas').height

        console.log(this.x);
        console.log(this.y);
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