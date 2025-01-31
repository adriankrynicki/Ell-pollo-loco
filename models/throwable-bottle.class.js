class ThrowableBottles extends MovableObject {
  collided = false;
  isAnimating = false;
  throwAnimationId;
  splashAnimationId;
  speedX = 4;
  speedY = -800;
  acceleration = 2000;
  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, services) {
    super().loadImage("");
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 100;
    this.otherDirection = true;
    this.services = services;
    this.id = `bottle_${Date.now()}`;
    this.throw();
  }

  throw() {
    this.throwAnimationId = `throw_${this.id}`;
    this.services.animationManager.addAnimation({
      id: this.throwAnimationId,
      update: (deltaTime) => {
        if (this.collided) {
          this.services.animationManager.removeAnimation(this.throwAnimationId);
          this.startSplashAnimation();
          return true;
        }
        this.applyGravity(deltaTime);
        this.x += this.speedX;
        this.playAnimation(this.IMAGES_BOTTLE, deltaTime, 20);
      }
    });
  }

  startSplashAnimation() {
    this.isAnimating = true;
    let currentFrame = 0;
    
    const splashAnimationId = `splash_${this.id}`;
    this.services.animationManager.addAnimation({
      id: splashAnimationId,
      update: (deltaTime) => {
        this.playAnimation(this.IMAGES_SPLASH, deltaTime, 50);
        currentFrame++;

        if (currentFrame >= this.IMAGES_SPLASH.length * 3) {
          this.isAnimating = false;
          this.services.animationManager.removeAnimation(splashAnimationId);
          if (this.onSplashComplete) this.onSplashComplete();
          return true;
        }
      }
    });
  }
}
