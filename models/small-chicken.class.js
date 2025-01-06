class SmallChicken extends MovableObject {
  y = 370;
  height = 60;
  width = 50;
  hp = 5;
  isJumping = false;
  isDeathAnimationPlaying = false;
  distanceTraveled = 0;
  isAnimated = false;
  walkInterval = null;
  deathCheckInterval = null;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor(id) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = id;
    this.x = this.getCoordinates(id);
    this.speed = 10 + Math.random() * 3;
    this.applayGravity();
  }

  startAnimation() {
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
    }
    if (this.deathCheckInterval) {
      clearInterval(this.deathCheckInterval);
    }

    this.walkInterval = setInterval(() => {
      if (this.isAnimated && !this.isDeathAnimationPlaying) {
        if (!this.isJumping && !this.isAboveGround()) {
          this.playAnimation(this.IMAGES_WALKING);
          this.randomJump();
          this.isJumping = false;
        }
        this.playAnimation(this.IMAGES_WALKING);
        this.moveLeft();
      }
    }, 60);

    this.deathCheckInterval = setInterval(() => {
      if (this.isDead() && !this.isDeathAnimationPlaying) {
        clearInterval(this.walkInterval);
        this.playDeathAnimation();
      }
    }, 500);
  }

  stopAnimation() {
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
    if (this.deathCheckInterval) {
      clearInterval(this.deathCheckInterval);
      this.deathCheckInterval = null;
    }
  }

  getCoordinates(id) {
    let coordinates = [
      1400, 2100, 2300, 2500, 2700, 2900, 3100, 3500, 4100, 4300, 4400, 4900,
      5200, 5500, 5600
    ];
    let index = id - 1;
    let startPosition;

    if (index >= 0 && index < coordinates.length) {
      startPosition = coordinates[index];
    } else {
      startPosition = 300;
    }

    return startPosition;
  }

  playDeathAnimation() {
    return new Promise((resolve) => {
      this.speedY = 0;
      this.isDeathAnimationPlaying = true;
      this.loadImage(this.IMAGE_DEAD);
      setTimeout(() => {
        this.isDeathAnimationPlaying = false;
        resolve();
      }, 200);
    });
  }

  randomJump() {
    this.distanceTraveled += this.speed;
    if (this.distanceTraveled >= 200 + Math.random() * 100) {
      this.isJumping = true;
      this.speedY = -25;
      this.distanceTraveled = 0;
    }
  }

  getHitbox() {
    return {
      x: this.x + this.width * 0.15, // 15% vom Rand
      y: this.y + this.height * 0.1,
      width: this.width * 0.7, // 70% der Originalbreite
      height: this.height * 0.8,
    };
  }

  deadSmallChickenSound() {
    world.sounds.playAudio("small_chicken");
  }
}
