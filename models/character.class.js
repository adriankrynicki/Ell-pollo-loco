/**
 * Represents the playable character in the game.
 * Handles character states, animations, and interactions.
 * Extends MovableObject for basic movement functionality.
 */
class Character extends MovableObject {
  /**
   * Timer for tracking idle time before sleep animation
   * @type {number}
   */
  sleepCountdown = 0;

  /**
   * Character status properties
   */
  hp = 100;
  characterIsDead = false;
  characterFullHealth = true;
  isInBossArea = false;

  /**
   * Character position and dimension properties
   */
  x = 100;
  y = 160;
  width = 135;
  height = 270;
  speed = 600;

  /**
   * Character action state flags
   */
  isSleeping = false;
  userIsPlaying = false;
  jumpActive = false;
  canJumpAgain = true;
  throwActive = false;

  /**
   * Precise hitbox for collision detection
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 115,
    left: 25,
    right: 40,
    bottom: 15,
  };

  /**
   * Defines all possible character states and their behaviors
   * @type {Array<{condition: Function, execute: Function, sound?: string}>}
   */
  characterStates = [
    {
      condition: () => this.noCharacterInteraction(),
      execute: (deltaTime) => {
        this.userIsPlaying = false;
      },
    },
    {
      condition: () => this.isHurt(),
      execute: (deltaTime) => {
        this.hurtAction(deltaTime);
        this.playAnimation(CharacterImages.IMAGES_HURT, deltaTime, 60);
      },
      sound: "character_hurt",
    },
    {
      condition: () => this.isDead(),
      execute: (deltaTime) => {
        this.characterIsDead = true;
        this.playAnimation(CharacterImages.IMAGES_DEAD, deltaTime, 10);
        return { playSound: true };
      },
      sound: "character_dead",
    },
    {
      condition: () =>
        this.world.keyboard.D &&
        this.services.bottleThrowManager.canThrowBottle(),
      execute: (deltaTime) => {
        this.executeBottleThrow(deltaTime);
      },
      sound: "bottle_throw",
    },
    {
      condition: () => this.services.world.keyboard.LEFT && this.canMoveLeft(),
      execute: (deltaTime) => {
        this.walkLeft(deltaTime);
        this.walkAnimation(deltaTime);
        return { playSound: true };
      },
      sound: "character_walking",
    },
    {
      condition: () =>
        this.services.world.keyboard.RIGHT &&
        this.levelEndReached() &&
        this.services.collisionHandler.canMoveRight,
      execute: (deltaTime) => {
        this.walkRight(deltaTime);
        this.walkAnimation(deltaTime);
        return { playSound: true };
      },
      sound: "character_walking",
    },
    {
      condition: () =>
        (this.services.world.keyboard.UP &&
          this.canJumpAgain &&
          !this.isAboveGround()) ||
        this.jumpActive,
      execute: (deltaTime) => {
        const jumpResult = this.performJump(deltaTime);
        this.animateJump(deltaTime);
        return jumpResult;
      },
      sound: "jump",
    },
    {
      condition: () =>
        !this.services.world.keyboard.UP && !this.isAboveGround(),
      execute: (deltaTime) => {
        this.canJumpAgain = true;
      },
    },
    {
      condition: () =>
        !this.userIsPlaying && !this.isSleeping && !this.jumpActive,
      execute: (deltaTime) => {
        this.startSleepingTimer(deltaTime);
        this.playAnimation(CharacterImages.IMAGES_IDLE, deltaTime, 6);
      },
    },
    {
      condition: () => !this.userIsPlaying && this.isSleeping,
      execute: (deltaTime) => {
        this.playAnimation(CharacterImages.IMAGES_SLEEP, deltaTime, 6);
        this.services.sounds.playAudio("snoring");
      },
      sound: "snoring",
    },
    {
      condition: () => this.userIsPlaying,
      execute: (deltaTime) => {
        this.clearSleepingTimer();
      },
    },
    {
      condition: () =>
        this.services.collectablesObjects.hasReachedCoinThreshold &&
        this.services.world.keyboard.S,
      execute: (deltaTime) => {
        this.services.collectablesObjects.restoreCharacterHealth();
      },
    },
  ];

  /**
   * Creates a new Character instance
   * @param {Object} services - Service dependencies
   * @param {World} services.world - Game world reference
   * @param {AnimationManager} services.animationManager - Animation manager reference
   */
  constructor(services) {
    super();
    this.services = services;
    this.world = services.world;
    this.animationManager = services.animationManager;

    this.loadImage(CharacterImages.IMAGES_IDLE[0]);
    this.loadAllCharacterImages();
  }

  /**
   * Initializes the character with the game level
   * @param {Level} level - The game level to initialize with
   */
  initialize(level) {
    this.services.world.level = level;
    this.initializeCharacterAnimation();
  }

  /**
   * Sets up the character's animation loop
   * @private
   */
  initializeCharacterAnimation() {
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (deltaTime === 0) return;
        if (this.canUpdate()) {
          this.updateCharacter(deltaTime);
        }
      },
    });
  }

  /**
   * Checks if character can be updated
   * @returns {boolean} True if character can be updated
   * @private
   */
  canUpdate() {
    return (
      this.services.world.level && !this.services.world.gameState.gamePaused
    );
  }

  /**
   * Updates character state and position
   * @param {number} deltaTime - Time passed since last frame
   * @private
   */
  updateCharacter(deltaTime) {
    this.applyGravity(deltaTime);
    this.handleCharacterState(deltaTime);
    this.updateCameraPosition();
  }

  /**
   * Loads all character animation images
   * @private
   */
  loadAllCharacterImages() {
    this.loadImages(CharacterImages.IMAGES_IDLE);
    this.loadImages(CharacterImages.IMAGES_WALKING);
    this.loadImages(CharacterImages.IMAGES_JUMPING);
    this.loadImages(CharacterImages.IMAGES_BOTTLE_THROW);
    this.loadImages(CharacterImages.IMAGES_WIN_DANCE);
    this.loadImages(CharacterImages.IMAGES_HURT);
    this.loadImages(CharacterImages.IMAGES_DEAD);
    this.loadImages(CharacterImages.IMAGES_SLEEP);
  }

  /**
   * Main method for handling character state updates
   * @param {number} deltaTime - Time passed since last frame
   */
  handleCharacterState(deltaTime) {
    if (this.checkWinState(deltaTime)) return;

    let activeStates = this.getActiveStates();
    this.handleSoundEffects();
    this.executeActiveStates(activeStates, deltaTime);
  }

  /**
   * Checks and handles win state animation
   * @param {number} deltaTime - Time passed since last frame
   * @returns {boolean} True if game is won, false otherwise
   */
  checkWinState(deltaTime) {
    if (this.services.world.gameState.gameWon) {
      this.playAnimation(CharacterImages.IMAGES_WIN_DANCE, deltaTime, 10);
      return true;
    }
    return false;
  }

  /**
   * Gets all currently active character states
   * @returns {Array} Array of active state objects
   */
  getActiveStates() {
    return this.characterStates.filter((state) => state.condition());
  }

  /**
   * Handles all sound-related effects
   */
  handleSoundEffects() {
    this.pauseWalkSound();
    this.pauseSnoringSound();
  }

  /**
   * Executes all active state behaviors
   * @param {Array} activeStates - Array of active state objects
   * @param {number} deltaTime - Time passed since last frame
   */
  executeActiveStates(activeStates, deltaTime) {
    activeStates.forEach((state) => {
      let result = state.execute(deltaTime);
      this.playStateSound(state, result);
    });
  }

  /**
   * Plays sound for a state if conditions are met
   * @param {Object} state - The state object
   * @param {Object} result - Result from state execution
   */
  playStateSound(state, result) {
    if (state.sound && result?.playSound) {
      this.services.sounds.playAudio(state.sound);
    }
  }

  /**
   * Moves character left
   * @param {number} deltaTime - Time passed since last frame
   */
  walkLeft(deltaTime) {
    this.moveLeft(deltaTime);
    this.otherDirection = true;
    this.userIsPlaying = true;
  }

  /**
   * Moves character right
   * @param {number} deltaTime - Time passed since last frame
   */
  walkRight(deltaTime) {
    this.moveRight(deltaTime);
    this.otherDirection = false;
    this.userIsPlaying = true;
  }

  /**
   * Handles character jump action
   * @param {number} deltaTime - Time passed since last frame
   * @returns {{playSound: boolean}} Indicates if jump sound should play
   */
  performJump(deltaTime) {
    if (!this.isAboveGround() && this.canJumpAgain) {
      this.speedY = -480;
      this.userIsPlaying = true;
      this.canJumpAgain = false;
      return { playSound: true };
    }
    return { playSound: false };
  }

  /**
   * Handles walking animation
   * @param {number} deltaTime - Time passed since last frame
   */
  walkAnimation(deltaTime) {
    if (!this.isAboveGround() && !this.jumpActive && !this.throwActive) {
      this.playAnimation(CharacterImages.IMAGES_WALKING, deltaTime, 15);
    }
  }

  /**
   * Handles bottle throw
   * @param {number} deltaTime - Time passed since last frame
   */
  executeBottleThrow(deltaTime) {
    this.throwActive = true;
    this.services.bottleThrowManager.manageBottleThrow();
    this.currentImage = 0;
    this.playAnimation(CharacterImages.IMAGES_BOTTLE_THROW, deltaTime, 60);
  }

  /**
   * Handles the complete jump animation process
   * @param {number} deltaTime - Time passed since last frame
   */
  animateJump(deltaTime) {
    this.initializeJumpAnimation();
    this.updateJumpAnimation(deltaTime);
  }

  /**
   * Initializes the jump animation if conditions are met
   */
  initializeJumpAnimation() {
    let shouldStartJump =
      !this.jumpActive &&
      !this.isAboveGround() &&
      this.services.world.keyboard.UP;

    if (shouldStartJump) {
      this.jumpActive = true;
      this.currentImage = 0;
    }
  }

  /**
   * Updates the ongoing jump animation and checks for completion
   * @param {number} deltaTime - Time passed since last frame
   */
  updateJumpAnimation(deltaTime) {
    if (!this.jumpActive) return;

    this.playAnimation(CharacterImages.IMAGES_JUMPING, deltaTime, 6.5);
    this.checkJumpAnimationComplete();
  }

  /**
   * Checks if jump animation should be completed and resets states
   */
  checkJumpAnimationComplete() {
    let shouldEndJump = !this.isAboveGround() && this.speedY === 0;

    if (shouldEndJump) {
      this.jumpActive = false;
      this.currentImage = 0;
    }
  }

  /**
   * Manages sleep timer state
   * @param {number} deltaTime - Time passed since last frame
   */
  startSleepingTimer(deltaTime) {
    if (this.world.gamePaused) return;

    if (!this.sleepCountdown) this.sleepCountdown = 0;
    this.sleepCountdown += deltaTime;
    if (this.sleepCountdown >= 10000 && !this.isSleeping) {
      this.isSleeping = true;
    }
  }

  /**
   * Clears the sleep timer and pauses snoring sound
   */
  clearSleepingTimer() {
    this.sleepCountdown = 0;
    this.isSleeping = false;
    this.services.sounds.pauseAudio("snoring");
  }

  /**
   * Pauses walking sound if conditions are met
   */
  pauseWalkSound() {
    if (
      (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) ||
      this.isAboveGround()
    ) {
      this.services.sounds.pauseAudio("character_walking");
    }
  }

  /**
   * Pauses snoring sound if conditions are met
   */
  pauseSnoringSound() {
    if (this.userIsPlaying) {
      this.services.sounds.pauseAudio("snoring");
      this.clearSleepingTimer();
    }
  }

  /**
   * Checks if character is not interacting with the game
   * @returns {boolean} True if character is not interacting, false otherwise
   */
  noCharacterInteraction() {
    return (
      !this.services.world.keyboard.LEFT &&
      !this.services.world.keyboard.RIGHT &&
      !this.services.world.keyboard.UP &&
      !this.services.world.keyboard.D &&
      !this.isHurt() &&
      !this.isDead()
    );
  }

  /**
   * Checks if character has reached the level end
   * @returns {boolean} True if character has reached the level end, false otherwise
   */
  levelEndReached() {
    return this.x < this.world?.level?.level_end_x;
  }

  /**
   * Checks if character can move left
   * @returns {boolean} True if character can move left, false otherwise
   */
  canMoveLeft() {
    return this.x > 0;
  }

  /**
   * Sets character as in boss area
   */
  inBossArea() {
    this.isInBossArea = true;
  }

  /**
   * Handles character hurt action
   * @param {number} deltaTime - Time passed since last frame
   */
  hurtAction(deltaTime) {
    this.clearSleepingTimer();
  }

  /**
   * Updates camera position
   */
  updateCameraPosition() {
    this.services.world.camera_x = -this.x + 100;
  }
}
