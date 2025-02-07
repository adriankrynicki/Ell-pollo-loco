/**
 * Represents a small chicken enemy in the game that can walk and jump.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /**
   * Small chicken position and dimension properties
   */
  y = 360;
  height = 60;
  width = 50;
  hp = 5;

  /**
   * Small chicken animation properties
   */
  animation = null;
  isAnimated = false;
  isKilled = false;

  /**
   * @type {boolean} Indicates if the chicken is currently jumping
   */
  isJumping = false;

  /**
   * @type {number} Distance the chicken has traveled
   */
  distanceTraveled = 0;

  /**
   * Precise hitbox for collision detection
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 0,
  };

  /**
   * @type {string[]} Array of image paths for walking animation
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * @type {string} Image path for dead chicken sprite
   */
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  /**
   * Creates a new SmallChicken instance
   * @param {number} id - Unique identifier for the chicken
   * @param {number} x - Initial horizontal position
   * @param {Object} services - Game service dependencies
   */
  constructor(id, x, services) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = id;
    this.speed = 120 + Math.random() * 20;
    this.x = x;
    this.services = services;
  }

  /**
   * Initializes chicken animation if not already animated
   */
  initializeAnimation() {
    if (this.isAnimated) return;

    let animation = this.createAnimationObject();
    this.addAnimationToManager(animation);
  }

  /**
   * Creates an animation object for the chicken
   * Add gravity to the chicken
   * @returns {Object} - Animation object with update method
   */
  createAnimationObject() {
    return {
      update: (deltaTime) => {
        if (this.canBeUpdated()) {
          this.animateSmallChicken(deltaTime);
          this.applyGravity(deltaTime);
        }
      },
    };
  }

  /**
   * Checks if the chicken can update its animation
   * @returns {boolean} - True if the chicken can update, false otherwise
   */
  canBeUpdated() {
    return !this.services?.world?.gameState?.gamePaused && !this.isDead();
  }

  /**
   * Adds the animation to the animation manager
   * @param {Object} animation - The animation object to add
   */
  addAnimationToManager(animation) {
    this.services.animationManager.addAnimation(animation);
    this.isAnimated = true;
  }

  /**
   * Animates the small chicken
   * @param {number} deltaTime - The time difference since the last update
   */
  animateSmallChicken(deltaTime) {
    if (!this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING, deltaTime, 20);
      this.moveLeft(deltaTime);
      this.otherDirection = false;
      this.randomJump(deltaTime);
    } else {
      this.playDeathAnimation();
    }
  }

  /**
   * Plays the death animation for the small chicken
   */
  playDeathAnimation() {
    this.isDeathAnimationPlaying = true;
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => {
      this.isDeathAnimationPlaying = false;
      this.isKilled = true;
    }, 200);
  }

  /**
   * Handles the chicken's jumping behavior
   * @param {number} deltaTime - The time difference since the last update
   */
  randomJump(deltaTime) {
    this.distanceTraveled += deltaTime;

    this.updateJumpingState();
    this.initializeJump();
  }

  /**
   * Updates the jumping state based on chicken's position
   */
  updateJumpingState() {
    if (!this.isAboveGround()) {
      this.isJumping = false;
    }
  }

  /**
   * Initializes the chicken's jump if conditions are met
   */
  initializeJump() {
    if (this.canJump()) {
      this.startJump();
    }
  }

  /**
   * Checks if the chicken can jump
   * @returns {boolean} - True if the chicken can jump, false otherwise
   */
  canJump() {
    return (
      this.distanceTraveled >= 1800 + Math.random() * 6000 && !this.isJumping
    );
  }

  /**
   * Starts the chicken's jump
   */
  startJump() {
    this.isJumping = true;
    this.speedY = -450;
    this.distanceTraveled = 0;
  }

  /**
   * Deletes the chicken animation from the animation manager
   */
  deleteAnimation() {
    if (this.animation) {
      this.services.animationManager.removeAnimation(this.animation);
      this.animation = null;
      this.isAnimated = false;
    }
  }
}
