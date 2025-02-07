/**
 * Represents the game world and manages all game components and their interactions.
 * Acts as the central hub for game state, services, and object management.
 */
class World {
  /**
   * Singleton instance of the World class
   * @type {World|null}
   * @private
   */
  static instance = null;

  /**
   * Gets the singleton instance of the World class
   * @returns {World|null} The singleton instance of World, or null if not initialized
   * @throws {Error} If accessed before initialization
   */
  static getInstance() {
    if (!World.instance) {
      throw new Error(
        "World instance has not been initialized yet. Create a new World instance first."
      );
    }
    return World.instance;
  }
  /**
   * @type {HTMLCanvasElement} The game's canvas element
   */
  canvas;

  /**
   * @type {CanvasRenderingContext2D} The canvas rendering context
   */
  ctx;

  /**
   * @type {Object} Keyboard input handler
   */
  keyboard;

  /**
   * @type {number} Camera offset on the x-axis
   */
  camera_x = 0;

  /**
   * @type {Level} Current game level
   */
  level;

  /**
   * @type {Object} Collection of game services and managers
   * @property {Character} character - The player character
   * @property {RenderManager} renderManager - Handles game rendering
   * @property {CollisionHandler} collisionHandler - Manages collision detection
   * @property {BottleThrowManager} bottleThrowManager - Handles bottle throwing mechanics
   * @property {CollectablesObjects} collectablesObjects - Manages collectible items
   * @property {GameStateManager} gameStateManager - Manages game state
   * @property {ScreenManager} screenManager - Handles screen transitions and UI
   */
  services;

  /**
   * @type {Character} The player character instance
   */
  character;

  /**
   * @type {Object} Current game state
   * @property {boolean} gamePaused - Indicates if game is paused
   * @property {boolean} gameWon - Indicates if game is won
   * @property {boolean} gameLost - Indicates if game is lost
   * @property {boolean} endbossBarActivated - Indicates if endboss health bar is shown
   */
  gameState = {
    gamePaused: false,
    gameWon: false,
    gameLost: false,
    endbossBarActivated: false,
  };

  /**
   * Creates a new World instance
   * @param {HTMLCanvasElement} canvas - The game's canvas element
   * @param {Object} keyboard - Keyboard input handler
   */
  constructor(canvas, keyboard) {
    if (World.instance) {
      return World.instance;
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.createBaseServices();
    this.createCharacterAndUI();
    this.createManagerObjects();

    World.instance = this;
  }

  /**
   * Initializes base game services.
   */
  createBaseServices() {
    this.services = {
      canvas: this.canvas,
      ctx: this.ctx,
      keyboard: this.keyboard,
      world: this,
      sounds: new Sounds(false),
    };

    const animationManager = AnimationManager.getInstance();
    animationManager.setServices(this.services);
    this.services.animationManager = animationManager;
  }

  /**
   * Creates character and initializes all status bars
   */
  createCharacterAndUI() {
    this.services.character = new Character(this.services);

    this.statusBars = {
      character: new CharacterHPBar(),
      bottle: new BottleStatusBar(),
      coin: new CoinStatusBar(),
    };
    this.services.statusBars = this.statusBars;
    this.services.endbossHpBar = new EndbossHpBar();
  }

  /**
   * Creates and initializes all manager objects for the game
   */
  createManagerObjects() {
    Object.assign(this.services, {
      screenManager: new ScreenManager(this.services),
      renderManager: new RenderManager(this.services),
      collisionHandler: new CollisionHandler(this.services),
      bottleThrowManager: new BottleThrowManager(this.services),
      collectablesObjects: new CollectablesObjects(this.services),
      gameStateManager: new GameStateManager(this.services),
    });
  }

  /**
   * Sets up and initializes the game level with all necessary components
   */
  setLevel() {
    this.resetAndInitializeAnimationManager();
    this.setupLevel();
    this.initializeGameComponents();
  }

  /**
   * Resets the current animation manager and gets a new instance
   */
  resetAndInitializeAnimationManager() {
    if (this.services.animationManager) {
      this.services.animationManager.reset();
    }
    this.services.animationManager = AnimationManager.getInstance();
  }

  /**
   * Sets up the level reference for the world and services
   */
  setupLevel() {
    this.level = level1;
    this.services.level = level1;
  }

  /**
   * Initializes all game components with the current level
   */
  initializeGameComponents() {
    if (!this.level) return;

    this.initializeManagers();
    this.initializeCharacter();
    this.startGameLoop();
  }

  /**
   * Initializes all manager components with the current level
   */
  initializeManagers() {
    this.services.renderManager.initialize(this.level);
    this.services.collisionHandler.initialize(this.level);
    this.services.collectablesObjects.initialize(this.level);
    this.services.gameStateManager.initialize(this.level);
  }

  /**
   * Initializes the character with the current level
   */
  initializeCharacter() {
    this.services.character.initialize(this.level);
  }

  /**
   * Starts or pauses the game loop based on game state
   */
  startGameLoop() {
    if (this.gameState.gamePaused) {
      this.services.animationManager.pause();
    } else {
      this.services.animationManager.resume();
    }
  }

  /**
   * Pauses the game by setting the pause state
   */
  pauseGame() {
    this.gameState.gamePaused = true;
  }

  /**
   * Resumes the game by clearing the pause state
   */
  resumeGame() {
    this.gameState.gamePaused = false;
  }

  /**
   * Resets the game by resetting the animation manager
   */
  resetGame() {
    this.services.animationManager.removeAllAnimations();
  }
}
