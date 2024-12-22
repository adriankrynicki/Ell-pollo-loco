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

  constructor(chickenCount) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = chickenCount;

    this.x = this.getRandomCoordinates(chickenCount);
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
        this.OtherDirection = false;
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

  getRandomCoordinates(chickenCount) {
    let coordinates = [
      300, 800, 1300, 1800, 2300, 2800, 3300, 3800, 4300, 4800,
    ];
    let index = chickenCount - 1;
    let startPosition;

    if (index >= 0 && index < coordinates.length) {
      startPosition = coordinates[index];
    } else {
      startPosition = 300;
    }

    return startPosition + Math.random() * 500;
  }

  playDeathAnimation() {
    return new Promise(resolve => {
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

  deadSmallChickenSound() {
    world.sounds.playAudio("small_chicken");
  }
}
