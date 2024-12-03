class SmallChicken extends MovableObject {
  y = 370;
  height = 60;
  width = 50;
  hp = 5;
  isJumping = false;
  dead_sound = new Audio("/audio/small-chicken.mp3");
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor(chickenCount) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = this.getRandomCoordinates(chickenCount);
    this.speed = 10 + Math.random() * 3;
    this.applayGravity();

    this.animate();
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

  animate() {
    let walkAnimation = setInterval(() => {
      if (!this.isJumping && !this.isAboveGround()) {
        this.playAnimation(this.IMAGES_WALKING);
        this.randomJump();
        this.isJumping = false;
      }
      this.playAnimation(this.IMAGES_WALKING);

      this.OtherDirection = false;
    }, 60);

    setInterval(() => {
      if (this.isDead()) {
        clearInterval(walkAnimation);
        this.loadImage(this.IMAGE_DEAD);
      }
    }, 500);
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
    world.sounds.playAudio("small-chicken");
  }
}
