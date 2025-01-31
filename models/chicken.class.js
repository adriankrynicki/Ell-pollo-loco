class Chicken extends MovableObject {
  y = 340;
  height = 80;
  width = 70;
  hp = 5;

  animation = null;
  isAnimated = false;
  isKilld = false;

  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 10,
    left: 5,
    right: 5,
    bottom: 0,
  };
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  constructor(id, x, services) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = id;
    this.speed = 70 + Math.random() * 2;
    this.x = x;
    this.services = services;
  }

  initializeAnimation() {
    if (!this.isAnimated) {
      const animation = {
        update: (deltaTime) => {
          if (!this.services?.world?.gameState?.gamePaused && !this.isDead()) {
            this.animateChicken(deltaTime);
          }
        },
      };

      this.services.animationManager.addAnimation(animation);
      this.isAnimated = true;
    }
  }

  removeAnimation(animationManager) {
    if (this.animation) {
      animationManager.removeAnimation(this.animation);
      this.animation = null;
      this.isAnimated = false;
      this.isKilld = true;
    }
  }

  animateChicken(deltaTime) {
    if (!this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING, deltaTime, 10);
      this.moveLeft(deltaTime);
      this.otherDirection = false;
    } else {
      this.playDeathAnimation();
    }
  }

  playDeathAnimation() {
    this.isDeathAnimationPlaying = true;
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => {
      this.isDeathAnimationPlaying = false;
      this.isKilld = true;
    }, 100);
  }
}
