class AnimationManager {
  static instance = null;
  isRunning = false;
  isPaused = false;

  // Statische Methode zum Abrufen der Singleton-Instanz
  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  setServices(services) {
    this.services = services;
  }

  constructor() {
    if (AnimationManager.instance) {
      console.warn(
        "Warnung: Versuch eine neue AnimationManager Instanz zu erstellen!"
      );
      return AnimationManager.instance;
    }
    this.animations = new Set();
    this.isRunning = false;
    this.lastTimestamp = 0;
    this.isPaused = false;
    this.animationFrameId = null;
    AnimationManager.instance = this;
  }

  addAnimation(animation) {
    this.animations.add(animation);

    if (!this.isRunning && !this.services?.world?.gameState.gamePaused) {
      this.start();
    }
  }

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

  animate = (timestamp) => {
    if (this.isPaused) return;

    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    const currentAnimations = Array.from(this.animations);
    for (const animation of currentAnimations) {
      if (
        this.animations.has(animation) &&
        !this.services?.world?.gameState.gamePaused
      ) {
        animation.update(deltaTime);
      }
    }

    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  removeAnimation(animation) {
    this.animations.delete(animation);
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  pause() {
    if (this.services.world.gameState.gamePaused) {
      this.isPaused = true;
    }
  }

  resume() {
    this.isPaused = false;
    this.start();
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTimestamp = performance.now();
      requestAnimationFrame(this.animate);
    }
  }

  stop() {
    this.isRunning = false;
  }

  reset() {
    this.removeAllAnimations();
    AnimationManager.instance = null;
  }
}
