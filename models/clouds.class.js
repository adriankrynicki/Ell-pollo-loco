class Clouds extends MovableObject {
    y = 10; 
    width = 700;
    height = 450;
    
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            this.OtherDirection = false;
        }, 1000 / 60);
    }
}