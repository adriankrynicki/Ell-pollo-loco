/**
 * Central manager for game loops and updates in the game.
 * Manages animation and update cycles of various game components.
 *
 * Implemented as a singleton for centralized coordination of all game loops.
 */
class AnimationManager {
  static instance = null;
  isRunning = false;
  isPaused = false;

  constructor() {
    if (AnimationManager.instance) {
      return AnimationManager.instance;
    }
    this.animations = new Set();
    this.isRunning = false;
    this.lastTimestamp = 0;
    this.isPaused = false;
    this.animationFrameId = null;
    AnimationManager.instance = this;
  }

  /**
   * Returns the singleton instance of the AnimationManager.
   * @returns {AnimationManager} The singleton instance of the AnimationManager
   */
  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  /**
   * Sets the service dependencies for the AnimationManager.
   * @param {Object} services - The service objects (e.g., world)
   */
  setServices(services) {
    this.services = services;
  }

  /**
   * The main animation loop.
   * @param {number} timestamp - The current timestamp from requestAnimationFrame
   */
  animate = (timestamp) => {
    if (this.isPaused) return;

    const deltaTime = this.calculateDeltaTime(timestamp);
    this.updateAnimations(deltaTime);

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  /**
   * Updates all active animations.
   * @param {number} deltaTime - The time difference since the last frame
   */
  updateAnimations(deltaTime) {
    let currentAnimations = Array.from(this.animations);
    for (let animation of currentAnimations) {
      if (
        this.animations.has(animation) &&
        !this.services?.world?.gameState.gamePaused
      ) {
        animation.update(deltaTime);
      }
    }
  }

  /**
   * Starts the animation loop.
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      requestAnimationFrame(this.animate);
    }
  }

  /**
   * Stops the animation loop.
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Pauses all animations when the game is paused.
   */
  pause() {
    if (this.services.world.gameState.gamePaused) {
      this.isPaused = true;
    }
  }

  /**
   * Resumes the paused animations.
   */
  resume() {
    this.isPaused = false;
    this.start();
  }

  /**
   * Adds a new animation to be managed.
   * @param {Object} animation - The animation to be managed
   */
  addAnimation(animation) {
    this.animations.add(animation);

    if (!this.isRunning && !this.services?.world?.gameState.gamePaused) {
      this.start();
    }
  }

  /**
   * Removes a specific animation from management.
   * @param {Object} animation - The animation to be removed
   */
  removeAnimation(animation) {
    this.animations.delete(animation);
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  /**
   * Removes all animations and stops the AnimationManager.
   */
  removeAllAnimations() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.animations.clear();
    this.stop();
    this.isPaused = false;
    this.lastTimestamp = 0;
  }

  /**
   * Calculates the time difference between two frames.
   * @param {number} timestamp - The current timestamp
   * @returns {number} The calculated time difference in milliseconds
   */
  calculateDeltaTime(timestamp) {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    return deltaTime;
  }

  /**
   * Completely resets the AnimationManager.
   */
  reset() {
    this.removeAllAnimations();
    AnimationManager.instance = null;
  }
}
