class MovableObject extends DrawableObject {
  // Basis-Bewegungsvariablen
  speed = 0.15; // Könnte als protected markiert werden, da es eine Basis-Eigenschaft ist
  speedY = 0; // Vertikale Geschwindigkeit für Sprünge/Fallen
  acceleration = 900; // Beschleunigung für Gravitation
  animationFrameTime = 0;

  // Status-Variablen
  hp = 100;
  lastHit = 0;

  distanceTraveled = 0;
  otherDirection = false;
  lastEndbossHit = 0;
  /**
   * Wendet Gravitation auf das Objekt an
   * @param {number} deltaTime - Verstrichene Zeit seit letztem Frame in ms
   */
  applyGravity(deltaTime) {
    const dt = deltaTime / 1000;

    // Bewegung nur anwenden wenn deltaTime gültig ist
    if (dt > 0) {
      // Position aktualisieren
      this.y += this.speedY * dt;

      // Gravitation anwenden
      this.speedY += this.acceleration * dt;

      if (this instanceof Character) {
        if (!this.isAboveGround()) {
          this.y = 160;
          this.speedY = 0;
        }
      } else if (this instanceof SmallChicken) {
        if (!this.isAboveGround()) {
          this.y = 360;
          this.speedY = 0;
        }
      } else if (this instanceof Endboss) {
        if (!this.isAboveGround()) {
          this.y = 60;
          this.speedY = 0;
        }
      }
    }
  }

  /**
   * Prüft ob sich das Objekt in der Luft befindet
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableBottles) {
      return true;
    } else if (this instanceof Endboss) {
      return this.y < 60;
    } else if (this instanceof SmallChicken) {
      return this.y < 360;
    } else if (this instanceof Character) {
      return this.y < 160;
    }
  }

  endbossKick() {
    let endbossKick = setInterval(() => {
      this.x -= 35;
    }, 25);
    setTimeout(() => {
      clearInterval(endbossKick);
    }, 500);
  }

  enemyKick() {
    let enemykick = setInterval(() => {
      this.x -= 7;
    }, 25);
    setTimeout(() => {
      clearInterval(enemykick);
    }, 500);
  }

  /**
   * Bewegt das Objekt horizontal
   * @param {number} deltaTime - Verstrichene Zeit seit letztem Frame in ms
   */
  moveLeft(deltaTime) {
    this.x -= this.speed * (deltaTime / 1000);
    this.otherDirection = false;
  }

  /**
   * Bewegt das Objekt horizontal
   * @param {number} deltaTime - Verstrichene Zeit seit letztem Frame in ms
   */
  moveRight(deltaTime) {
    this.x += this.speed * (deltaTime / 1000);
    this.otherDirection = true;
  }

  jump() {
    this.speedY = -30;
  }

  playAnimation(images, deltaTime, frameRate = 60) {
    this.animationFrameTime += deltaTime;

    if (this.animationFrameTime >= 1000 / frameRate) {
      this.animationFrameTime = 0;
      let i = this.currentImage % images.length;
      const path = images[i];
      if (this.imageCach[path]) {
        this.img = this.imageCach[path];
      }
      this.currentImage++;
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  bottledamage() {
    this.hp -= 10;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }



  hit(damage) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassd = new Date().getTime() - this.lastHit;
    timePassd = timePassd / 1000;
    return timePassd < 0.3;
  }

  isDead() {
    return this.hp <= 0;
  }
}
