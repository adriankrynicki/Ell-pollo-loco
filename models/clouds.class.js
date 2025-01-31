class Clouds extends MovableObject {
  y = 10;
  width = 700;
  height = 450;
  speed = 10;
  isAnimated = false;

  constructor(x, imageType, services) {
    super().loadImage(`img/5_background/layers/4_clouds/${imageType}.png`);
    this.x = x;
    this.services = services;
  }

  initialize() {
    if (!this.isAnimated) {
      this.addAnimation();
      this.isAnimated = true;
    }
  }

  addAnimation() {
    this.services.animationManager.addAnimation({
      update: (deltaTime) => {
        if (!this.services?.world?.gameState?.gamePaused) {
          this.moveLeft(deltaTime);
          this.OtherDirection = false;
        }
      },
    });
  }
}
