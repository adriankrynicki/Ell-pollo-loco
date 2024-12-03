class Chicken extends MovableObject {
  y = 350;
  height = 80;
  width = 70;
  hp = 5;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  constructor(chickenCount) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = this.getRandomCoordinates(chickenCount);
    this.speed = 5 + Math.random() * 2;

    this.animate();
  }

  getRandomCoordinates(chickenCount) {
    let coordinates = [300, 500, 800, 1000, 1300, 1600, 1900, 2300, 2500, 2800];
    let index = chickenCount - 1;
    let startPosition;

    if (index >= 0 && index < coordinates.length) {
      startPosition = coordinates[index];
    } else {
      startPosition = 300;
    }

    return startPosition;
  }

  animate() {
    let walkAnimation = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);

      this.OtherDirection = false;
    }, 100);

    setInterval(() => {
      if (this.isDead()) {
        clearInterval(walkAnimation);
        this.loadImage(this.IMAGE_DEAD);
      }
    }, 500);
  }

  deadChickenSound() {
    world.sounds.playAudio("chicken");  
  }
}
