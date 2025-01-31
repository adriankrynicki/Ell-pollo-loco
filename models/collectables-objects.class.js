/**
 * Handles all collectable object interactions in the game.
 * @class
 */
class CollectablesObjects {
  collectedBottles = 0;
  collectedCoins = 0;
  hasReachedBottleThreshold = false;
  hasReachedCoinThreshold = false;

  firstBottleCollected = true;
  /** @type {Object} Defines collection detection ranges */
  static COLLECTION_RANGES = {
    HORIZONTAL: 200,
  };

  constructor(services) {
    this.services = services;
    this.animationManager = services.animationManager;
  }

  initialize(level) {
    this.services.world.level = level;

    // Animationen erst nach Level-Initialisierung hinzufügen
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (
          this.services.world.level &&
          !this.services.world.gameState.gamePaused
        ) {
          this.checkCollectedBottles();
          this.checkCollectedCoins();
          this._checkHealthRestore();
          this.checkBottleThreshold();
        }
      },
    });
  }

  /**
   * Checks and handles collection of bottles within range of the character.
   */
  checkCollectedBottles() {
    if (
      this.services.world.level &&
      this.services.world.level.collectableBottles
    ) {
      this.services.world.level.collectableBottles.forEach((bottle) => {
        if (
          this.services.character.isColliding(bottle) &&
          !bottle.isCollected &&
          !this.hasReachedBottleThreshold
        ) {
          this._handleBottleCollection(bottle);
        }
      });
    }
  }

  /**
   * Checks and handles collection of coins within range of the character.
   */
  checkCollectedCoins() {
    if (!this._areCollectablesAvailable("collectableCoins")) return;

    this.services.world.level.collectableCoins.forEach((coin) => {
      if (
        this.services.character.isColliding(coin) &&
        !coin.isCollected &&
        !this.hasReachedCoinThreshold
      ) {
        coin.isCollected = true;
        this._handleCoinCollection(coin);
      }
    });
  }

  /**
   * Checks if collectables of specified type are available in the level.
   * @param {string} collectableType - Type of collectable to check
   * @returns {boolean} True if collectables are available
   * @private
   */
  _areCollectablesAvailable(collectableType) {
    return (
      this.services.world.level && this.services.world.level[collectableType]
    );
  }

  /**
   * Handles the collection of a bottle.
   * @param {Bottle} bottle - The bottle being collected
   * @private
   */
  _handleBottleCollection(bottle) {
    this.services.bottleThrowManager.bottleThrowAvailable = true;
    bottle.isCollected = true;
    this.collectedBottles++;
    this.services.world.statusBars.bottle.setPercentage(
      this.collectedBottles * 10
    );
    this.services.sounds.playAudio("bottle_collect");
    this.deleteBottle(bottle);
  }

  /**
   * Handles the collection of a coin.
   * @param {Coin} coin - The coin being collected
   * @private
   */
  _handleCoinCollection(coin) {
    this.collectedCoins++;
    this.services.sounds.playAudio("coin_collect");
    this.deleteCoin(coin);
    this.services.world.statusBars.coin.setPercentage(this.collectedCoins * 5);
  }

  /**
   * Checks and handles health restoration when enough coins are collected.
   * @private
   */
  _checkHealthRestore() {
    if (this.collectedCoins <= 18) return;

    if (this.collectedCoins >= 20) {
      this.hasReachedCoinThreshold = true;
    }
  }

  /**
   * Restores character's health to full.
   * @private
   */
  restoreCharacterHealth() {
    if (this.hasReachedCoinThreshold && this.services.world.keyboard.S) {
      this.services.character.hp = 100;
      this.hasReachedCoinThreshold = false;
      this.collectedCoins = 0;
      this.services.world.statusBars.character.setPercentage(
        this.services.character.hp
      );
      this.services.world.statusBars.coin.setPercentage(0);
      this.services.sounds.playAudio("hp_restored");
    }
  }

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
  _deleteCollectable(object, collectionType) {
    const collection = this.services.world.level[collectionType];
    const index = collection.indexOf(object);

    if (index > -1) {
      collection.splice(index, 1);
    }
  }

  /**
   * Removes a bottle from the game world.
   * @param {Bottle} bottle - The bottle to remove
   */
  deleteBottle(bottle) {
    this._deleteCollectable(bottle, "collectableBottles");
  }

  /**
   * Removes a coin from the game world.
   * @param {Coin} coin - The coin to remove
   */
  deleteCoin(coin) {
    this._deleteCollectable(coin, "collectableCoins");
  }

  calculatePercentage(collected, total) {
    return (collected / total) * 100;
  }
}
