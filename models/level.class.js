/**
 * Represents a game level containing all game objects and boundaries
 * Manages enemies, clouds, background objects, and collectables
 */
class Level {
    /**
     * Array of enemy objects in the level
     * @type {Enemy[]}
     */
    enemies;

    /**
     * Array of cloud objects for background atmosphere
     * @type {Cloud[]}
     */
    clouds;

    /**
     * Array of background objects for level scenery
     * @type {BackgroundObject[]}
     */
    backgroundObjects;

    /**
     * Array of collectable bottle objects
     * @type {Bottle[]}
     */
    collectableBottles;

    /**
     * Array of collectable coin objects
     * @type {Coin[]}
     */
    collectableCoins;

    /**
     * Defines the right boundary of the level
     * @type {number}
     */
    level_end_x = 20000;

    /**
     * Creates a new Level instance
     * @param {Enemy[]} enemies - Array of enemy objects
     * @param {Cloud[]} clouds - Array of cloud objects
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects
     * @param {Bottle[]} collectableBottles - Array of collectable bottles
     * @param {Coin[]} collectableCoins - Array of collectable coins
     */
    constructor(enemies, clouds, backgroundObjects, collectableBottles, collectableCoins) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableBottles = collectableBottles;
        this.collectableCoins = collectableCoins;
    }
}