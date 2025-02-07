/**
 * Represents an enemy chicken in the game.
 * Handles chicken movement, animations, and behavior.
 */
class Chicken extends MovableObject {
  /**
   * Chicken position and dimension properties
   */
  y = 340;
  height = 80;
  width = 70;
  hp = 5;

  /**
   * Chicken animation properties
   */
  animation = null;
  isAnimated = false;
  isKilled = false;

  /**
   * Precise hitbox for collision detection
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 10,
    left: 5,
    right: 5,
    bottom: 0,
  };

  /**
   * Chicken walking animation images
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /**
   * Chicken dead animation image
   * @type {string}
   */
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  /**
   * Constructor for Chicken class
   * @param {number} id - Unique identifier for the chicken
   * @param {number} x - Initial x-coordinate for the chicken
   * @param {Object} services - Services object containing game state and other dependencies
   */
  constructor(id, x, services) {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.number = id;
    this.speed = 70 + Math.random() * 2;
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
   * @returns {Object} - Animation object with update method
   */
  createAnimationObject() {
    return {
      update: (deltaTime) => {
        if (this.canBeUpdated()) {
          this.animateChicken(deltaTime);
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
   * Animates the chicken based on the delta time
   * @param {number} deltaTime - The time difference since the last frame
   */
  animateChicken(deltaTime) {
    if (!this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING, deltaTime, 10);
      this.moveLeft(deltaTime);
      this.otherDirection = false;
    } else {
      this.playDeathAnimation();
    }
  }

  /**
   * Plays the chicken's death animation
   */
  playDeathAnimation() {
    this.isDeathAnimationPlaying = true;
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => {
      this.isDeathAnimationPlaying = false;
      this.isKilled = true;
    }, 100);
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
