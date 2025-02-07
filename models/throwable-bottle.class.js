/**
 * Represents a throwable bottle object in the game.
 * Handles bottle animations, movement, collisions and splash effects.
 * @extends MovableObject
 */
class ThrowableBottles extends MovableObject {
  /**
   * @type {boolean} Indicates if the bottle has collided with something
   */
  collided = false;

  /**
   * @type {boolean} Indicates if the bottle is currently animating
   */
  isAnimating = false;

  /**
   * @type {string} ID for the throwing animation
   */
  throwAnimationId;

  /**
   * @type {string} ID for the splash animation
   */
  splashAnimationId;

  /**
   * @type {number} Horizontal speed of the bottle
   */
  speedX = 4;

  /**
   * @type {number} Vertical speed of the bottle (negative for upward movement)
   */
  speedY = -800;

  /**
   * @type {number} Gravity acceleration applied to the bottle
   */
  acceleration = 2000;

  /**
   * @type {Object} Collision offset values for precise hit detection
   */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  /**
   * @type {string[]} Array of image paths for bottle rotation animation
   */
  IMAGES_BOTTLE = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * @type {string[]} Array of image paths for bottle splash animation
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable bottle instance
   * @param {number} x - Initial X position of the bottle
   * @param {number} y - Initial Y position of the bottle
   * @param {boolean} otherDirection - Indicates if the bottle is facing the opposite direction
   * @param {Object} services - Game service dependencies for animation and state management
   */
  constructor(x, y, services) {
    super().loadImage("");
    this.loadImages(this.IMAGES_BOTTLE);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 100;
    this.otherDirection = true;
    this.services = services;
    this.id = `bottle_${Date.now()}`;
    this.throw();
  }

  /**
   * Initiates the bottle throwing animation and movement
   */
  throw() {
    this.initializeThrowAnimation();
  }

  /**
   * Sets up the throw animation with collision and movement handling
   */
  initializeThrowAnimation() {
    this.throwAnimationId = this.generateThrowId();
    this.services.animationManager.addAnimation({
      id: this.throwAnimationId,
      update: (deltaTime) => this.updateBottleAnimation(deltaTime)
    });
  }

  /**
   * Generates a unique ID for the throw animation
   * @returns {string} Unique animation identifier
   */
  generateThrowId() {
    return `throw_${this.id}`;
  }

  /**
   * Updates the bottle's position and animation state
   * @param {number} deltaTime - Time passed since last update
   * @returns {boolean} True if animation should end, false otherwise
   */
  updateBottleAnimation(deltaTime) {
    if (this.collided) {
      return this.handleCollision();
    }
    this.updateBottleMovement(deltaTime);
    return false;
  }

  /**
   * Handles the bottle's collision state
   * @returns {boolean} True to end the animation
   */
  handleCollision() {
    this.services.animationManager.removeAnimation(this.throwAnimationId);
    this.startSplashAnimation();
    return true;
  }

  /**
   * Updates the bottle's position and visual animation
   * @param {number} deltaTime - Time passed since last update
   */
  updateBottleMovement(deltaTime) {
    this.applyGravity(deltaTime);
    this.x += this.speedX;
    this.playAnimation(this.IMAGES_BOTTLE, deltaTime, 20);
  }

  /**
   * Initiates the splash animation when bottle breaks
   */
  startSplashAnimation() {
    this.isAnimating = true;
    const splashAnimationId = this.generateSplashId();
    this.addSplashAnimation(splashAnimationId);
  }

  /**
   * Generates a unique ID for the splash animation
   * @returns {string} Unique splash animation identifier
   */
  generateSplashId() {
    return `splash_${this.id}`;
  }

  /**
   * Adds the splash animation to the animation manager
   * @param {string} splashAnimationId - The ID for the splash animation
   */
  addSplashAnimation(splashAnimationId) {
    let currentFrame = 0;
    this.services.animationManager.addAnimation({
      id: splashAnimationId,
      update: (deltaTime) => this.updateSplashAnimation(deltaTime, currentFrame++, splashAnimationId)
    });
  }

  /**
   * Updates the splash animation state
   * @param {number} deltaTime - Time passed since last update
   * @param {number} currentFrame - Current animation frame
   * @param {string} splashAnimationId - Animation identifier
   * @returns {boolean} True if animation should end
   */
  updateSplashAnimation(deltaTime, currentFrame, splashAnimationId) {
    this.playAnimation(this.IMAGES_SPLASH, deltaTime, 60);

    if (this.isSplashAnimationComplete(currentFrame)) {
      return this.finishSplashAnimation(splashAnimationId);
    }
  }

  /**
   * Checks if splash animation has completed its cycles
   * @param {number} currentFrame - Current animation frame
   * @returns {boolean} True if animation is complete
   */
  isSplashAnimationComplete(currentFrame) {
    return currentFrame >= this.IMAGES_SPLASH.length * 2;
  }

  /**
   * Handles the completion of splash animation
   * @param {string} splashAnimationId - Animation identifier
   * @returns {boolean} True to signal animation end
   */
  finishSplashAnimation(splashAnimationId) {
    this.isAnimating = false;
    this.services.animationManager.removeAnimation(splashAnimationId);
    if (this.onSplashComplete) this.onSplashComplete();
    return true;
  }
}
