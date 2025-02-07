/**
 * Manages the bottle throwing mechanics in the game.
 * Handles bottle availability, throwing logic, and bottle object lifecycle.
 */
class BottleThrowManager {
  /**
   * Flag indicating if bottle throwing is currently available
   * @type {boolean}
   */
  bottleThrowAvailable = false;

  /**
   * Creates a new BottleThrowManager instance
   * @param {Object} services - Service dependencies required by the manager
   * @param {World} services.world - Reference to the game world
   * @param {Character} services.character - Reference to the player character
   * @param {SoundManager} services.sounds - Reference to the sound manager
   */
  constructor(services) {
    this.services = services;
    this.throwableBottles = new Map();
  }

  /**
   * Checks if a bottle can currently be thrown
   * @returns {boolean} True if bottle throwing is available and no bottle is currently in flight
   */
  canThrowBottle() {
    return this.bottleThrowAvailable && this.throwableBottles.size < 1;
  }

  /**
   * Manages the bottle throwing action if conditions are met
   */
  manageBottleThrow() {
    if (this.canThrowBottle()) {
      this.handleBottleThrow();
    }
  }

  /**
   * Handles the complete bottle throwing process.
   */
  handleBottleThrow() {
    this.createAndThrowBottle();
    this.updateBottleCount();
    this.resetThrowState();
  }

  /**
   * Creates a new throwable bottle and adds it to active bottles.
   * Also plays the throw sound effect.
   */
  createAndThrowBottle() {
    let bottle = new ThrowableBottles(
      this.services.character.x + 30,
      this.services.character.y + 100,
      this.services
    );
    this.throwableBottles.set(bottle.id, bottle);
    this.services.sounds.playAudio("bottle_throw");
  }

  /**
   * Updates the bottle count and status bar after throwing.
   * Disables throwing if no bottles remain.
   */
  updateBottleCount() {
    this.services.collectablesObjects.collectedBottles--;
    this.services.world.statusBars.bottle.setPercentage(
      this.services.collectablesObjects.collectedBottles * 10
    );

    if (this.services.collectablesObjects.collectedBottles === 0) {
      this.bottleThrowAvailable = false;
    }
  }

  /**
   * Resets the character's throw animation state after a delay.
   */
  resetThrowState() {
    setTimeout(() => {
      this.services.character.throwActive = false;
    }, 200);
  }
}
