class ThrowableBottles extends MovableObject {
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

  constructor(x, y) {
    super().loadImage("");
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 100;
    this.throw();
  }

  collided = false;
  throwIntervals = [];

  throw() {
    this.speedY = -30;
    this.applayGravity();
    this.throwIntervals.push(
      setInterval(() => {
        this.x += 5;
      }, 15)
    );

    this.throwIntervals.push(
      setInterval(() => {
        this.playAnimation(this.IMAGES_BOTTLE);
      }, 60)
    );
  }

  stopThrow() {
    this.throwIntervals.forEach((interval) => clearInterval(interval));
    this.throwIntervals = [];
    this.speedY = 0;
    this.acceleration = 0;
  }

  bottleSplash(callback) {
    let splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 60);

    setTimeout(() => {
      clearInterval(splashInterval);
      if (callback) callback();
    }, this.IMAGES_SPLASH.length * 40); 
  }

  bottleSplashSound() {
    world.sounds.playAudio("bottle_splash");  
  }

  bottleThrowSound() {
    world.sounds.playAudio("bottle_throw");
  }

}
