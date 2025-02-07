class CollectableCoin extends MovableObject {
  /**
   * Coin position and dimension properties
   */
  width = 100;
  height = 100;
  /**
   * Flag indicating if the coin has been collected
   * @type {boolean}
   */
  isCollected = false;

  /**
   * Precise hitbox for collision detection
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 35,
    left: 35,
    right: 35,
    bottom: 35,
  };

  /**
   * Creates a new CollectableCoin instance
   * @param {string} imagePath - Path to the coin image
   * @param {number} x - X-coordinate position of the coin
   * @param {number} y - Y-coordinate position of the coin
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
