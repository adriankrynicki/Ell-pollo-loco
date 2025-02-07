/**
 * Represents a status bar that visualizes various game metrics (health, coins, bottles).
 */
class StatusBar extends DrawableObject {
    /**
     * @type {number} Current percentage value of the status bar (0-100)
     */
    percentage = 100;

    /**
     * Creates a new StatusBar instance.
     */
    constructor() {
        super();
        /**
         * @type {number} Width of the status bar in pixels
         */
        this.width = 200;

        /**
         * @type {number} Height of the status bar in pixels
         */
        this.height = 50;
    }

    /**
     * Determines which image to display based on the current percentage value
     * @returns {number} Index of the image to display (0-5)
     */
    resolveImage() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 79) {
            return 4;
        } else if (this.percentage > 59) {
            return 3;
        } else if (this.percentage > 39) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}