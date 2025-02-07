/**
 * Handles all collectable object interactions in the game.
 */
class CollectablesObjects {
  /**
   * Number of bottles collected by the character
   * @type {number}
   */
  collectedBottles = 0;
  /**
   * Number of coins collected by the character
   * @type {number}
   */
  collectedCoins = 0;

  /**
   * Flag indicating if bottle collection threshold is reached
   * @type {boolean}
   */
  hasReachedBottleThreshold = false;

  /**
   * Flag indicating if coin collection threshold is reached
   * @type {boolean}
   */
  hasReachedCoinThreshold = false;

  /**
   * Creates a new CollectablesObjects instance
   * @param {Object} services - Service dependencies
   * @param {AnimationManager} services.animationManager - Animation manager reference
   * @param {World} services.world - Game world reference
   */
  constructor(services) {
    this.services = services;
    this.animationManager = services.animationManager;
  }

  /**
   * Initializes the collectables system with the given level
   * @param {Level} level - The game level to initialize
   */
  initialize(level) {
    this.services.world.level = level;
    this.initializeCollectablesChecks();
  }

  /**
   * Initializes the periodic checks for collectables
   * @private
   */
  initializeCollectablesChecks() {
    let animation = this.createCollectablesChecks();
    this.animationManager.addAnimation(animation);
  }

  /**
   * Creates an interval check object for collectable items
   * Uses AnimationManager's update cycle to periodically check collectable states
   * @returns {Object} Update object with check method for AnimationManager
   */
  createCollectablesChecks() {
    return {
      update: (deltaTime) => {
        if (
          this.services.world.level &&
          !this.services.world.gameState.gamePaused
        ) {
          this.checkCollectedBottles();
          this.checkCollectedCoins();
          this.checkBottleThreshold();
        }
      },
    };
  }

  /**
   * Checks and handles collection of bottles.
   */
  checkCollectedBottles() {
    if (!this.areCollectablesAvailable("collectableBottles")) return;

    this.services.world.level.collectableBottles.forEach((bottle) => {
      if (this.canCollectBottle(bottle)) {
        this.handleBottleCollection(bottle);
      }
    });
  }

  /**
   * Checks if a bottle can be collected
   * @param {Bottle} bottle - The bottle to check
   * @returns {boolean} True if bottle can be collected
   * @private
   */
  canCollectBottle(bottle) {
    return (
      this.services.character.isColliding(bottle) &&
      !bottle.isCollected &&
      !this.hasReachedBottleThreshold
    );
  }

  /**
   * Checks and handles collection of coins.
   */
  checkCollectedCoins() {
    if (!this.areCollectablesAvailable("collectableCoins")) return;

    this.services.world.level.collectableCoins.forEach((coin) => {
      if (this.canCollectCoin(coin)) {
        this.handleCoinCollection(coin);
      }
    });
  }

  /**
   * Checks if a coin can be collected
   * @param {Coin} coin - The coin to check
   * @returns {boolean} True if coin can be collected
   * @private
   */
  canCollectCoin(coin) {
    return (
      this.services.character.isColliding(coin) &&
      !coin.isCollected &&
      !this.hasReachedCoinThreshold
    );
  }

  /**
   * Checks if collectables of specified type are available in the level.
   * @param {string} collectableType - Type of collectable to check
   * @returns {boolean} True if collectables are available
   * @private
   */
  areCollectablesAvailable(collectableType) {
    return (
      this.services.world.level && this.services.world.level[collectableType]
    );
  }

  /**
   * Handles the collection of a bottle.
   * @param {Bottle} bottle - The bottle being collected
   * @private
   */
  handleBottleCollection(bottle) {
    this.services.bottleThrowManager.bottleThrowAvailable = true;
    bottle.isCollected = true;
    this.collectedBottles++;
    this.services.world.statusBars.bottle.setPercentage(
      this.collectedBottles * 10
    );
    this.services.sounds.playAudio("bottle_collect");
    this.deleteCollectable(bottle, "collectableBottles");
  }

  /**
   * Handles the collection of a coin.
   * @param {Coin} coin - The coin being collected
   * @private
   */
  handleCoinCollection(coin) {
    this.collectedCoins++;
    coin.isCollected = true;
    this.services.sounds.playAudio("coin_collect");
    this.deleteCollectable(coin, "collectableCoins");
    this.services.world.statusBars.coin.setPercentage(
      this.calculatePercentage(this.collectedCoins, 20)
    );
    this.checkHealthRestore();
  }

  /**
   * Checks and handles health restoration when enough coins are collected.
   * @private
   */
  checkHealthRestore() {
    if (this.collectedCoins <= 16) return;

    if (this.collectedCoins == 20) {
      this.hasReachedCoinThreshold = true;
    }
  }

  /**
   * Performs health restoration
   */
  restoreCharacterHealth() {
    if (this.canRestoreHealth()) {
      this.hasReachedCoinThreshold = false;
      this.collectedCoins = 0;
      this.healCharacter();
      this.updateStatusBars();
    }
  }

  /**
   * Checks if health can be restored
   * @returns {boolean} True if health restoration is possible
   */
  canRestoreHealth() {
    return (
      this.hasReachedCoinThreshold &&
      this.services.world.keyboard.S &&
      !this.services.character.characterFullHealth
    );
  }

  /**
   * Restores character's health to full
   */
  healCharacter() {
    this.services.character.hp = 100;
    this.services.character.characterFullHealth = true;
    this.services.sounds.playAudio("hp_restored");
  }

  /**
   * Updates all relevant status bars
   */
  updateStatusBars() {
    this.services.world.statusBars.character.setPercentage(
      this.services.character.hp
    );
    this.services.world.statusBars.coin.setPercentage(0);
  }

  /**
   * Checks and updates bottle collection threshold
   */
  checkBottleThreshold() {
    if (this.collectedBottles <= 8) return;

    if (this.collectedBottles >= 10) {
      this.hasReachedBottleThreshold = true;
    } else {
      this.hasReachedBottleThreshold = false;
    }
  }

  /**
   * Removes a collectable object from the game world.
   * @param {GameObject} object - The object to remove (Bottle or Coin)
   * @param {string} collectionType - The type of collection ('collectableBottles' or 'collectableCoins')
   * @private
   */
  deleteCollectable(object, collectionType) {
    const collection = this.services.world.level[collectionType];
    const index = collection.indexOf(object);

    if (index > -1) {
      collection.splice(index, 1);
    }
  }

  /**
   * Calculates percentage based on collected and total values
   * @param {number} collected - Number of items collected
   * @param {number} total - Total number of items possible
   * @returns {number} Percentage value
   */
  calculatePercentage(collected, total) {
    return (collected / total) * 100;
  }
}
