/**
 * Handles all collectable object interactions in the game.
 * @class
 */
class CollectablesObjects {
  /** @type {Object} Defines collection detection ranges */
  static COLLECTION_RANGES = {
    HORIZONTAL: 200,
  };

  /**
   * Creates a new collectables handler instance.
   * @param {World} world - The game world instance
   */
  constructor(world) {
    this.world = world;
    this.coinsCollected = 0;
  }

  // Getter methods
  get character() {
    return this.world.character;
  }
  get level() {
    return this.world.level;
  }
  get bottleThrowManager() {
    return this.world.bottleThrowManager;
  }
  get bottleStatusbar() {
    return this.world.bottleStatusbar;
  }
  get characterHPBar() {
    return this.world.characterHPBar;
  }
  get sounds() {
    return this.world.sounds;
  }
  get coinStatusBar() {
    return this.world.coinStatusBar;
  }

  /**
   * Checks and handles collection of bottles within range of the character.
   */
  checkCollectedBottles() {
    if (!this._areCollectablesAvailable("collectableBottles")) return;

    const nearbyBottles = this._getNearbyCollectables(
      this.level.collectableBottles
    );

    nearbyBottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this._handleBottleCollection(bottle);
      }
    });
  }

  /**
   * Checks and handles collection of coins within range of the character.
   */
  checkCollectedCoins() {
    if (!this._areCollectablesAvailable("collectableCoins")) return;

    const nearbyCoins = this._getNearbyCollectables(
      this.level.collectableCoins
    );

    nearbyCoins.forEach((coin) => {
      if (this.character.isCollected(coin)) {
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
    return this.level && this.level[collectableType];
  }

  /**
   * Filters collectables that are within collection range of the character.
   * @param {Array} collectables - Array of collectable objects
   * @returns {Array} Collectables within range
   * @private
   */
  _getNearbyCollectables(collectables) {
    return collectables.filter((collectable) =>
      this._isInCollectionRange(this.character, collectable)
    );
  }

  /**
   * Checks if an object is within collection range of the character.
   * @param {GameObject} obj1 - First game object (usually the character)
   * @param {GameObject} obj2 - Second game object (the collectable)
   * @returns {boolean} True if objects are within range
   * @private
   */
  _isInCollectionRange(obj1, obj2) {
    const distance = Math.abs(obj1.x - obj2.x);
    return distance <= CollectablesObjects.COLLECTION_RANGES.HORIZONTAL;
  }

  /**
   * Handles the collection of a bottle.
   * @param {Bottle} bottle - The bottle being collected
   * @private
   */
  _handleBottleCollection(bottle) {
    this.bottleThrowManager.bottleCollected++;
    bottle.bottleCollectSound();
    this.deleteBottle(bottle);
    this.bottleStatusbar.setPercentage(
      this.bottleThrowManager.bottleCollected * 10
    );
  }

  /**
   * Handles the collection of a coin.
   * @param {Coin} coin - The coin being collected
   * @private
   */
  _handleCoinCollection(coin) {
    this.coinsCollected++;
    coin.coinSound();
    this.deleteCoin(coin);
    this.coinStatusBar.setPercentage(this.coinsCollected * 5);
    this._checkHealthRestore();
  }

  /**
   * Checks and handles health restoration when enough coins are collected.
   * @private
   */
  _checkHealthRestore() {
    if (this.coinsCollected >= 20) {
      this._restoreCharacterHealth();
      this._resetCoinsIfHealthFull();
    }
  }

  /**
   * Restores character's health to full.
   * @private
   */
  _restoreCharacterHealth() {
    this.character.hp = 100;
    this.characterHPBar.setPercentage(this.character.hp);
    this.sounds.playAudio("hp_restored");
  }

  /**
   * Resets coin count if character's health is full.
   * @private
   */
  _resetCoinsIfHealthFull() {
    if (this.character.hp >= 100 && this.coinsCollected >= 20) {
      this.coinsCollected = 0;
    }
  }

  /**
   * Removes a collectable object from the game world.
   * @param {GameObject} object - The object to remove (Bottle or Coin)
   * @param {string} collectionType - The type of collection ('collectableBottles' or 'collectableCoins')
   * @private
   */
  _deleteCollectable(object, collectionType) {
    const collection = this.level[collectionType];
    const index = collection.indexOf(object);

    if (index > -1) {
      collection.splice(index, 1);
      this.world.draw();
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
}
