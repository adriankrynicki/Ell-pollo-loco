/**
 * Manages the rendering of the game and coordinates the display of all game objects
 */
class RenderManager {
  /**
   * @type {HTMLCanvasElement} Canvas element for game rendering
   */
  canvas;

  /**
   * @type {CanvasRenderingContext2D} Rendering context for 2D drawing operations
   */
  ctx;

  /**
   * @type {World} Reference to the game world
   */
  world;

  /**
   * @type {boolean} Flag indicating if the endboss has been activated
   */
  endbossActivated = false;

  /**
   * @type {number} Timestamp of the last rendered frame
   */
  lastFrameTime = 0;

  /**
   * @type {number} Interval between frames in milliseconds (for 60 FPS)
   */
  frameInterval = 1000 / 60;

  /**
   * @type {AnimationManager} Manager for animations
   */
  animationManager;

  /**
   * @type {Level} Current level object
   */
  level;

  /**
   * @type {MovableObject} Helper object for drawing movable objects
   */
  drawer;

  /**
   * Creates a new instance of the RenderManager
   * @param {Object} services - Services and dependencies for the RenderManager
   * @param {HTMLCanvasElement} services.canvas - The canvas element
   * @param {CanvasRenderingContext2D} services.ctx - The rendering context
   * @param {World} services.world - The game world
   * @param {AnimationManager} services.animationManager - The animation manager
   */
  constructor(services) {
    this.canvas = services.canvas;
    this.ctx = services.ctx;
    this.world = services.world;
    this.animationManager = services.animationManager;
    this.services = services;

    this.drawer = new MovableObject();
    this.drawer.ctx = this.ctx;
  }

  /**
   * Initializes the RenderManager with a given level
   * @param {Level} level - The level to initialize with
   */
  initialize(level) {
    this.level = level;

    this.startRender();
  }

  /**
   * Starts the rendering process
   */
  startRender() {
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (this.canRender()) {
          this.render();
        }
      },
    });
  }

  /**
   * Checks if the rendering can be performed
   * @returns {boolean} True if rendering can be performed, false otherwise
   */
  canRender() {
    return (
      this.services.world.level && !this.services.world.gameState.gamePaused
    );
  }

  /**
   * Performs the rendering process
   */
  render() {
    if (!this.services.world.level) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.world.camera_x, 0);
    this.drawBackground();
    this.drawClouds();
    this.drawCollectableObjects();
    this.drawEnemies();
    this.drawThrowableBottles();
    this.drawCharacter();
    this.ctx.translate(-this.world.camera_x, 0);
    this.drawStatusBars();
    this.services.screenManager.drawEndScreen();
  }

  /**
   * Draws the background objects
   */
  drawBackground() {
    if (this.services.world.level?.backgroundObjects) {
      this.drawer.addObjectToMap(this.services.world.level.backgroundObjects);
    }
  }

  /**
   * Draws the clouds
   */
  drawClouds() {
    if (!this.services.world?.level) return;

    this.services.world.level.clouds.forEach((cloud) => {
      if (!cloud.isAnimated) {
        cloud.initialize();
      }
    });

    this.drawer.addObjectToMap(this.services.world.level.clouds);
  }

  /**
   * Draws the throwable bottles
   */
  drawThrowableBottles() {
    if (!this.services?.bottleThrowManager?.throwableBottles) return;

    for (const [id, bottle] of this.services.bottleThrowManager
      .throwableBottles) {
      this.drawer.addToMap(bottle);
    }
  }

  /**
   * Draws the character
   */
  drawCharacter() {
    if (this.services?.character) {
      this.drawer.addToMap(this.services.character);
    }
  }

  /**
   * Draws the collectable objects
   */
  drawCollectableObjects() {
    if (
      this.services.world.level?.collectableCoins &&
      this.services.world.level?.collectableBottles
    ) {
      const collectables = [
        ...this.services.world.level.collectableCoins,
        ...this.services.world.level.collectableBottles,
      ];

      this.drawer.addObjectToMap(collectables);
    }
  }

  /**
   * Draws the status bars
   */
  drawStatusBars() {
    const { character, statusBars, endbossHpBar } = this.services;
    if (!statusBars) return;

    this.checkIfInBossArea(character);
    this.drawEndbossHealthBar(character, endbossHpBar);
    this.drawPlayerStatusBars(statusBars);
  }

  /**
   * Checks if the character is in the boss area
   * @param {Character} character - The character to check
   */
  checkIfInBossArea(character) {
    if (character?.x > 19300) {
      character.isInBossArea = true;
    }
  }

  /**
   * Draws the endboss health bar
   * @param {Character} character - The character to check
   * @param {EndbossHpBar} endbossHpBar - The endboss health bar to draw
   */
  drawEndbossHealthBar(character, endbossHpBar) {
    if (character.isInBossArea && endbossHpBar) {
      endbossHpBar.draw(this.ctx);
    }
  }

  /**
   * Draws the player status bars
   * @param {StatusBars} statusBars - The status bars to draw
   */
  drawPlayerStatusBars(statusBars) {
    statusBars?.character?.draw(this.ctx);
    statusBars?.bottle?.draw(this.ctx);
    statusBars?.coin?.draw(this.ctx);
  }

  /**
   * Coordinates the enemy drawing process by checking if enemies
   * can be drawn, processing active enemies, and handling the
   * removal of dead enemies.
   */
  drawEnemies() {
    if (!this.canDrawEnemies()) return;

    const enemiesToRemove = this.processEnemies();
    this.removeDeadEnemies(enemiesToRemove);
  }

  /**
   * Checks if the enemies can be drawn
   * @returns {boolean} True if enemies can be drawn, false otherwise
   */
  canDrawEnemies() {
    return this.services.world.level?.enemies && this.services?.character;
  }

  /**
   * Prepares the settings object for enemy processing and initiates
   * the enemy list processing.
   * Extracts necessary data from game services and defines the core
   * parameters for enemy handling.
   *
   * @returns {Array<Enemy>} List of enemies that need to be removed from the game
   */
  processEnemies() {
    const { character, world } = this.services;
    const settings = {
      characterX: character.x,
      activationDistance: 1200,
      removalX: -300,
    };

    return this.processEnemyList(world.level.enemies, settings);
  }

  /**
   * Iterates through the enemy array and processes each valid enemy individually.
   *
   * @param {Array<Enemy>} enemies - Array of enemies to process
   * @param {Object} settings - Configuration object for enemy processing
   * @param {number} settings.characterX - Current X position of the character
   * @param {number} settings.activationDistance - Distance at which enemies become active
   * @param {number} settings.removalX - X coordinate threshold for enemy removal
   * @returns {Array<Enemy>} Collection of enemies marked for removal
   */
  processEnemyList(enemies, settings) {
    const enemiesToRemove = [];

    enemies.forEach((enemy) => {
      if (!enemy) return;
      this.processIndividualEnemy(enemy, settings, enemiesToRemove);
    });

    return enemiesToRemove;
  }

  /**
   * Processes a single enemy by handling its animation, checking removal conditions,
   * and drawing it if appropriate.
   *
   * @param {Enemy} enemy - The enemy object to process
   * @param {Object} settings - Processing configuration parameters
   * @param {number} settings.characterX - Character's X position
   * @param {number} settings.activationDistance - Enemy activation range
   * @param {number} settings.removalX - X position threshold for removal
   * @param {Array<Enemy>} enemiesToRemove - Array to collect enemies marked for removal
   */
  processIndividualEnemy(enemy, settings, enemiesToRemove) {
    const isEndboss = enemy instanceof Endboss;
    const distance = Math.abs(enemy.x - settings.characterX);

    this.handleEnemyAnimation(enemy, distance, settings.activationDistance);

    if (this.shouldRemoveEnemy(enemy, isEndboss, settings.removalX)) {
      enemiesToRemove.push(enemy);
      return;
    }

    this.drawEnemyIfAlive(enemy);
  }

   /**
   * Initializes enemy animation if the enemy is within activation range and still alive.
   * 
   * @param {Enemy} enemy - The enemy to handle animation for
   * @param {number} distance - Current distance between enemy and character
   * @param {number} activationDistance - Distance threshold for animation activation
   */
  handleEnemyAnimation(enemy, distance, activationDistance) {
    if (!enemy.isKilled && distance < activationDistance) {
      if (!enemy.isAnimated) {
        enemy.initializeAnimation();
      }
    }
  }

  /**
   * Checks if the enemy should be removed
   * @param {Enemy} enemy - The enemy to check
   * @param {boolean} isEndboss - Whether the enemy is the endboss
   * @param {number} removalX - The removal X position
   * @returns {boolean} True if the enemy should be removed, false otherwise
   */
  shouldRemoveEnemy(enemy, isEndboss, removalX) {
    return !isEndboss && (enemy.isKilled || enemy.x <= removalX);
  }

  /**
   * Draws the enemy if it is alive
   * @param {Enemy} enemy - The enemy to draw
   */
  drawEnemyIfAlive(enemy) {
    if (!enemy.isKilled) {
      this.drawer.addToMap(enemy);
    }
  }

  /**
   * Removes dead enemies
   * @param {Array} enemiesToRemove - The list of enemies to remove
   */
  removeDeadEnemies(enemiesToRemove) {
    enemiesToRemove.forEach((enemy) => {
      enemy.deleteAnimation(enemy.animation);
      this.removeFromMap(enemy);
    });
  }

  /**
   * Removes an enemy from the map
   * @param {Enemy} enemy - The enemy to remove
   */
  removeFromMap(enemy) {
    const index = this.services.world.level.enemies.indexOf(enemy);
    if (index !== -1) {
      this.services.world.level.enemies.splice(index, 1);
    }
  }
}
