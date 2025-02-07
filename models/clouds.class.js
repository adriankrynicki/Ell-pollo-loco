/**
 * Represents the cloud objects in the game background.
 * Handles cloud movement and animation.
 */
class Clouds extends MovableObject {
  /**
   * Cloud position and dimension properties
   */
  y = 10;
  width = 700;
  height = 450;
  speed = 10;

  /**Flag indicating if the cloud is currently animated
   * @type {boolean}
   */
  isAnimated = false;

  /**
   * Creates a new Clouds instance
   * @param {number} x - Initial x position of the cloud
   * @param {string} imageType - Type of cloud image to load
   * @param {Object} services - Service dependencies
   */
  constructor(x, imageType, services) {
    super().loadImage(`img/5_background/layers/4_clouds/${imageType}.png`);
    this.x = x;
    this.services = services;
  }

  /**
   * Initializes the cloud animation if not already animated
   */
  initialize() {
    if (!this.isAnimated) {
      this.addAnimation();
      this.isAnimated = true;
    }
  }

  /**
   * Adds continuous movement animation to the cloud
   */
  addAnimation() {
    this.services.animationManager.addAnimation({
      update: (deltaTime) => {
        if (!this.services?.world?.gameState?.gamePaused) {
          this.moveLeft(deltaTime);
          this.OtherDirection = false;
        }
      },
    });
  }
}
