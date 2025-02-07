/**
 * Manages keyboard input states for game controls
 * Tracks the state of various keyboard keys used for character movement and actions
 */
class Keyboard {
    /**
     * Creates a new Keyboard instance
     * Initializes all key states to false
     */
    constructor() {
        /**
         * State of the UP arrow key or equivalent
         * Used for jumping actions
         * @type {boolean}
         */
        this.UP = false;

        /**
         * State of the LEFT arrow key or equivalent
         * Used for moving left
         * @type {boolean}
         */
        this.LEFT = false;

        /**
         * State of the RIGHT arrow key or equivalent
         * Used for moving right
         * @type {boolean}
         */
        this.RIGHT = false;

        /**
         * State of the D key
         * Used for throwing bottles
         * @type {boolean}
         */
        this.D = false;

        /**
         * State of the S key
         * Used for healing
         * @type {boolean}
         */
        this.S = false;
    }
}