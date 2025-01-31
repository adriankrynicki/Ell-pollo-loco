class SmallChicken extends MovableObject {
  y = 360;
  height = 60;
  width = 50;
  hp = 5;
  isJumping = false;
  isDeathAnimationPlaying = false;
  animation = null;
  isAnimated = false;
  isKilld = false;
  walkInterval = 100;
  timeElapsed = 0;
  distanceTraveled = 0;
  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 0,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor(id, x, services) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = id;
    this.speed = 120 + Math.random() * 20;
    this.x = x;
    this.services = services;
  }

  initializeAnimation() {
    // Besserer Name als addAnimation
    if (!this.isAnimated) {
      const animation = {
        update: (deltaTime) => {
          if (!this.services?.world?.gameState?.gamePaused && !this.isDead()) {
            this.animateSmallChicken(deltaTime);
            this.applyGravity(deltaTime);            
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

  animateSmallChicken(deltaTime) {
    if (!this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING, deltaTime, 20);
      this.moveLeft(deltaTime);
      this.otherDirection = false;
      this.randomJump(deltaTime);
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
    }, 200);
  }

  randomJump(deltaTime) {
    this.distanceTraveled += deltaTime;
    
    // Wenn das Chicken am Boden ist, Sprung-Status zurücksetzen
    if (!this.isAboveGround()) {
      this.isJumping = false;
    }
    
    // Neuen Sprung nur starten wenn nicht in der Luft
    if (this.distanceTraveled >= 3000 + Math.random() * 30000 && !this.isJumping) {
      this.isJumping = true;
      this.speedY = -450;
      this.distanceTraveled = 0;
    }
  }
}
