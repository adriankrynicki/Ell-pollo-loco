class Clouds extends MovableObject {
    y = 10; 
    width = 700;
    height = 450;
    
    constructor(x, imageType) {
        super().loadImage(`img/5_background/layers/4_clouds/${imageType}.png`);
        this.x = x;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            this.OtherDirection = false;
        }, 1000 / 60);
    }
}