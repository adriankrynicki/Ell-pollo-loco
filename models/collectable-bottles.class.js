class CollectableBottles extends MovableObject {
  /**
   * Bottles position and dimension properties
   */
  y = 350;
  height = 100;
  width = 75;
  /**
   * Flag indicating if the bottle has been collected
   * @type {boolean}
   */
  isCollected = false;

  /**
   * Precise hitbox for collision detection
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 20,
    left: 30,
    right: 30,
    bottom: 20,
  };

  /**
   * Creates a new CollectableBottles instance
   * @param {string} imagePath - Path to the bottle image
   * @param {number} bottleCount - Number of the bottle (used for positioning)
   */
  constructor(imagePath, bottleCount) {
    super().loadImage(imagePath);

    this.x = this.getCoordinates(bottleCount);
  }

  /**
   * Determines the x-coordinate for bottle placement based on bottle count
   * @param {number} bottleCount - Number of the bottle
   * @returns {number} The x-coordinate for bottle placement
   * @private
   */
  getCoordinates(bottleCount) {
    let coordinates = this.getBottleCoordinatesArray();
    let index = this.calculateBottleIndex(bottleCount);
    return this.determineStartPosition(index, coordinates);
  }

  /**
   * Returns the array of predefined bottle coordinates
   * @returns {number[]} Array of x-coordinates for bottles
   * @private
   */
  getBottleCoordinatesArray() {
    return [
      720, 1400, 1700, 2800, 3100, 3600, 3900, 4200, 4500, 5000, 5300, 5600,
      5900, 6200, 6500, 6800, 7100, 7400, 7700, 8000, 8720, 9400, 10000, 11000,
      12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
    ];
  }

  /**
   * Calculates the array index for the bottle based on bottle count
   * @param {number} bottleCount - Number of the bottle
   * @returns {number} Zero-based index for the coordinates array
   * @private
   */
  calculateBottleIndex(bottleCount) {
    return bottleCount - 1;
  }

  /**
   * Determines the start position for the bottle based on index
   * @param {number} index - Array index for the bottle
   * @param {number[]} coordinates - Array of possible coordinates
   * @returns {number} The final x-coordinate for bottle placement
   * @private
   */
  determineStartPosition(index, coordinates) {
    if (this.isValidIndex(index, coordinates)) {
      return coordinates[index];
    }
    return this.getDefaultPosition();
  }

  /**
   * Checks if the given index is valid for the coordinates array
   * @param {number} index - Index to check
   * @param {number[]} coordinates - Array of coordinates
   * @returns {boolean} True if index is valid
   * @private
   */
  isValidIndex(index, coordinates) {
    return index >= 0 && index < coordinates.length;
  }

  /**
   * Returns the default position for bottles with invalid index
   * @returns {number} Default x-coordinate
   * @private
   */
  getDefaultPosition() {
    return 700;
  }
}
