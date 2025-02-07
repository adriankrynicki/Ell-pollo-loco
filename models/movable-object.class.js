/**
 * Represents a movable object that can move horizontally and vertically
 */
class MovableObject extends DrawableObject {
  /**
   * The speed of the object
   * @type {number}
   */
  speed = 0.15; 

  /**
   * The vertical speed of the object
   * @type {number}
   */
  speedY = 0; 

  /**
   * The acceleration of the object
   * @type {number}
   */
  acceleration = 900; 

  /**
   * The time elapsed since the last frame in milliseconds
   * @type {number}
   */
  animationFrameTime = 0;

  /**
   * The hit points of the object
   * @type {number}
   */
  hp = 100;

  /**
   * The time of the last hit
   * @type {number}
   */
  lastHit = 0;

  /**
   * The distance traveled by the object
   * @type {number}
   */
  distanceTraveled = 0;

  /**
   * The direction of the object
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Applies gravity to the object
   * @param {number} deltaTime - Time elapsed since the last frame in ms
   */
  applyGravity(deltaTime) {
    let timeInSeconds = deltaTime / 1000;
    if (timeInSeconds > 0) {
      this.updateVerticalPosition(timeInSeconds);
      this.handleGroundCollision();
    }
  }

  /**
   * Updates the vertical position based on speed and acceleration
   * @param {number} timeInSeconds - Time elapsed since the last frame in seconds
   */
  updateVerticalPosition(timeInSeconds) {
    this.y += this.speedY * timeInSeconds;
    this.speedY += this.acceleration * timeInSeconds;
  }

  /**
   * Handles collision with ground for different entity types
   */
  handleGroundCollision() {
    if (!this.isAboveGround()) {
      this.resetOnGroundLevel();
    }
  }

  /**
   * Resets the entity to its specific ground level
   */
  resetOnGroundLevel() {
    const groundLevels = {
      Character: 160,
      SmallChicken: 360,
      Endboss: 60,
    };

    const entityType = this.constructor.name;
    if (groundLevels[entityType] !== undefined) {
      this.y = groundLevels[entityType];
      this.speedY = 0;
    }
  }

  /**
   * Checks if the object is in the air
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

  /**
   * Applies a knockback effect to the object
   * @param {number} knockBackStrength - The strength of the knockback
   */
  knockBack(knockBackStrength) {
    let knockBack = setInterval(() => {
      this.x -= knockBackStrength;
    }, 25);
    setTimeout(() => {
      clearInterval(knockBack);
    }, 500);
  }

  /**
   * Moves the object horizontally
   * @param {number} deltaTime - Time elapsed since the last frame in ms
   */
  moveLeft(deltaTime) {
    this.x -= this.speed * (deltaTime / 1000);
    this.otherDirection = false;
  }

  /**
   * Moves the object horizontally
   * @param {number} deltaTime - Time elapsed since the last frame in ms
   */
  moveRight(deltaTime) {
    this.x += this.speed * (deltaTime / 1000);
    this.otherDirection = true;
  }

  /**
   * Moves the object vertically
   */
  jump() {
    this.speedY = -30;
  }

  /**
   * Plays the animation for the object
   * @param {string[]} images - Array of image paths
   * @param {number} deltaTime - Time elapsed since the last frame in ms
   * @param {number} frameRate - The frame rate of the animation
   */
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

  /**
   * Checks if the object is colliding with another object
   * @param {MovableObject} mo - The other object to check collision with
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Applies damage to the object
   * @param {number} damage - The amount of damage to apply
   */
  hit(damage) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks time passed since last hit
   * @returns {boolean}
   */
  isHurt() {
    let timePassd = new Date().getTime() - this.lastHit;
    timePassd = timePassd / 1000;
    return timePassd < 0.3;
  }

  /**
   * Checks if the object is dead
   * @returns {boolean}
   */
  isDead() {
    return this.hp <= 0;
  }
}
