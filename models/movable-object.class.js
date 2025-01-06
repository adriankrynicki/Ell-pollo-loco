class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
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

  enemyKick() {
    let enemykick = setInterval(() => {
      this.x -= 3;
    }, 25);
    setTimeout(() => {
      clearInterval(enemykick);
    }, 500);
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
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

  getHitbox() {
    return {
      x: this.x + this.width * 0.1,
      y: this.y + this.height * 0.1,
      width: this.width * 0.8,
      height: this.height * 0.8
    };
  }

  isColliding(mo) {
    let hitboxA = this.getHitbox();
    let hitboxB = mo.getHitbox();

    return (
      hitboxA.x < hitboxB.x + hitboxB.width &&
      hitboxA.x + hitboxA.width > hitboxB.x &&
      hitboxA.y < hitboxB.y + hitboxB.height &&
      hitboxA.y + hitboxA.height > hitboxB.y
    );
  }

  isCollidingWithEndbossAboveGround(mo) {
    let characterHitbox = this.getHitbox();
    let endbossHitbox = mo.getHitbox();
    
    return (
      characterHitbox.x < endbossHitbox.x + endbossHitbox.width * 0.8 &&
      characterHitbox.x + characterHitbox.width > endbossHitbox.x + endbossHitbox.width * 0.2 &&
      characterHitbox.y + characterHitbox.height > endbossHitbox.y &&
      characterHitbox.y < endbossHitbox.y + endbossHitbox.height * 0.3
    );
  }

  isCollidingWithEndbossOnGround(mo) {
    let characterHitbox = this.getHitbox();
    let endbossHitbox = mo.getHitbox();
    
    return (
      characterHitbox.x < endbossHitbox.x + endbossHitbox.width * 0.9 &&
      characterHitbox.x + characterHitbox.width > endbossHitbox.x + endbossHitbox.width * 0.1 &&
      characterHitbox.y + characterHitbox.height > endbossHitbox.y + endbossHitbox.height * 0.5
    );
  }

  isCollected(mo) {
    let collectionHitbox = {
      x: this.x + this.width * 0.3,
      y: this.y + this.height * 0.3,
      width: this.width * 0.4,
      height: this.height * 0.4
    };

    let itemHitbox = mo.getHitbox();

    return (
      collectionHitbox.x < itemHitbox.x + itemHitbox.width &&
      collectionHitbox.x + collectionHitbox.width > itemHitbox.x &&
      collectionHitbox.y < itemHitbox.y + itemHitbox.height &&
      collectionHitbox.y + collectionHitbox.height > itemHitbox.y
    );
  }

  bottledamage() {
    this.hp -= 40;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastEndbossHit = new Date().getTime();
    }
  }

  isEndbossHurt() {
    let timePassd = new Date().getTime() - this.lastEndbossHit;
    timePassd = timePassd / 1000;
    return timePassd < 0.3;
  }

  hit() {
    this.hp -= 20;
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
