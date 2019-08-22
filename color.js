class GameColor {
    constructor(redVal, greenVal, blueVal) {
        this.redVal = redVal;
        this.greenVal = greenVal;
        this.blueVal = blueVal;
    }

    getRGBString() {
        return `rgb(${this.redVal}, ${this.greenVal}, ${this.blueVal})`;
    }
}

module.exports = {
    GameColor: GameColor
}