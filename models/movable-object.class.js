class MovableObject extends DrawableObject {
  speed = 0.15;
  OtherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  hp = 100;
  lastHit = 0;
  lastEndbossHit = 0;
  distanceTraveled = 0;

  applayGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY < 0) {
        this.y += this.speedY;
        this.speedY += this.acceleration;
      }
      if (this.y >= 160 && this instanceof Character) {
        this.y = 160;
        this.speedY = 0;
      }
    }, 40);
  }

  isAboveGround() {
    if (this instanceof ThrowableBottles) {
      return true;
    } else if (this instanceof Endboss) {
      return this.y < 60;
    } else if (this instanceof SmallChicken) {
      return this.y < 370;
    } else if (this instanceof Character) {
      return this.y < 160;
    }
  }

  Endbosskick() {
    let Endbosskick = setInterval(() => {
      this.x -= 4;
    }, 25);
    setTimeout(() => {
      clearInterval(Endbosskick);
    }, 500);
  }

  moveLeft() {
    this.x -= this.speed;
    this.OtherDirection = true;
  }

  moveRight() {
    this.x += this.speed;
    this.OtherDirection = false;
  }

  jump() {
    this.speedY = -30;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCach[path];
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.x + 10 + this.width - 20 > mo.x + 10 &&
      this.y + 10 + this.height - 20 > mo.y + 10 &&
      this.x + 10 < mo.x + 10 + mo.width - 20 &&
      this.y + 10 < mo.y + 10 + mo.height - 20
    );
  }

  isCollidingWithEndbossAboveGround(mo) {
    return (
      this.x - 30 + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  isCollidingWithEndbossOnGround(mo) {
    return (
      this.x - 60 + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  isCollected(mo) {
    return (
      this.x + 20 + this.width - 40 > mo.x + 10 &&
      this.y + 110 + this.height - 125 > mo.y + 10 &&
      this.x + 20 < mo.x + 10 + mo.width - 20 &&
      this.y + 110 < mo.y + 10 + mo.height - 20
    );
  }

  bottledamage() {
    this.hp -= 5;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastEndbossHit = new Date().getTime();
    }
  }

  isEndbossHurt() {
    let timePassd = new Date().getTime() - this.lastEndbossHit;
    timePassd = timePassd / 1000;
    return timePassd < 1.5;
  }

  hit() {
    this.hp -= 5;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassd = new Date().getTime() - this.lastHit;
    timePassd = timePassd / 1000;
    return timePassd < 1.5;
  }

  isDead() {
    return this.hp == 0;
  }
}
