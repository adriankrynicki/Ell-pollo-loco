/**
 * Base class for all drawable objects
 * @class
 */
class DrawableObject {
  /**
   * X-coordinate position of the object
   * @type {number}
   */
  x;
  /**
   * Y-coordinate position of the object
   * @type {number}
   */
  y;
  /**
   * Image element of the object
   * @type {HTMLImageElement}
   */
  img;
  /**
   * Width of the object
   * @type {number}
   */
  width;
  /**
   * Height of the object
   * @type {number}
   */
  height;
  /**
   * Image cache for loading images
   * @type {Object}
   */
  imageCach = {};
  /**
   * Current image index
   * @type {number}
   */
  currentImage = 0;

  /**
   * Loads a single image
   * @param {string} path - Path to the image
   * @returns {Promise} Promise that resolves when image is loaded
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    return new Promise((resolve) => {
      this.img.onload = () => resolve();
    });
  }

  /**
   * Loads multiple images and stores them in cache
   * @param {string[]} arr - Array of image paths
   * @returns {Promise} Promise that resolves when all images are loaded
   */
  loadImages(arr) {
    return Promise.all(
      arr.map((path) => {
        return new Promise((resolve) => {
          if (this.imageCach[path]) {
            resolve();
            return;
          }
          let img = new Image();
          img.onload = () => resolve();
          img.src = path;
          this.imageCach[path] = img;
        });
      })
    );
  }

  /**
   * Draws the object on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   */
  draw(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Fügt ein Array von Objekten zur Map hinzu
   * @param {DrawableObject[]} objects - Array von zeichenbaren Objekten
   */
  addObjectToMap(objects) {
    if (Array.isArray(objects)) {
      objects.forEach((obj) => this.addToMap(obj));
    }
  }

  /**
   * Adds a single object to the map
   * @param {DrawableObject} mo - The object to be drawn
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image horizontally
   * @param {DrawableObject} mo - The object to be flipped
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the original image orientation
   * @param {DrawableObject} mo - The object to be restored
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
