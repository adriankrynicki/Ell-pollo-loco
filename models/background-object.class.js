/**
 * Represents a background object in the game.
 * Handles the creation and positioning of background elements like mountains, clouds, etc.
 * Extends DrawableObject to inherit basic drawing functionality.
 */
class BackgroundObject extends DrawableObject {
    /**
     * Default width of the background object in pixels
     * @type {number}
     */
    width = 720;

    /**
     * Default height of the background object in pixels
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new background object.
     * @param {string} imagePath - The path to the image file for this background object
     * @param {number} x - The x-coordinate position of the background object
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}