/**
 * Handles all collision detection and resolution in the game.
 * @class
 */
class CollisionHandler {
  /**
   * Flag indicating if character is currently on an enemy
   * @type {boolean}
   */
  onAnEnemy = false;

  /**
   * Flag indicating if character is immune to damage
   * @type {boolean}
   */
  damageImmune = false;

  /**
   * Flag indicating if character can move right
   * @type {boolean}
   */
  canMoveRight = true;

  /**
   * Defines collision detection ranges
   * @type {{horizontal: number, vertical: number}}
   */
  collisionRanges = {
    horizontal: 300,
    vertical: 370,
  };

  /**
   * Creates a new CollisionHandler instance
   * @param {Object} services - Service dependencies
   * @param {Canvas} services.canvas - Game canvas reference
   * @param {CanvasRenderingContext2D} services.ctx - Canvas context
   * @param {World} services.world - Game world reference
   * @param {Keyboard} services.keyboard - Keyboard input handler
   * @param {SoundManager} services.sounds - Sound effects manager
   * @param {AnimationManager} services.animationManager - Animation manager
   */
  constructor(services) {
    this.services = services;
    this.canvas = services.canvas;
    this.ctx = services.ctx;
    this.world = services.world;
    this.keyboard = services.keyboard;
    this.sounds = services.sounds;
    this.animationManager = services.animationManager;
  }

  /**
   * Initializes collision handler with given level
   * @param {Level} level - The game level to initialize
   */
  initialize(level) {
    this.services.world.level = level;
    this.initializeCollisionsChecks();
  }

  /**
   * Initializes periodic collision checks
   */
  initializeCollisionsChecks() {
    let animation = this.createCollisionsChecks();
    this.animationManager.addAnimation(animation);
  }

  /**
   * Creates an interval check object for collision detection
   * Uses AnimationManager's update cycle to periodically check collision states
   * @returns {Object} Update object with check method for AnimationManager
   */
  createCollisionsChecks() {
    return {
      update: (deltaTime) => {
        if (this.canBeUpdated()) {
          this.checkCollisionsWithEnemies();
          this.checkEnemyJumpState();
          this.checkIfBottleHit();
        }
      },
    };
  }

  /**
   * Checks if collision updates can be performed
   * @returns {boolean} True if updates are possible
   */
  canBeUpdated() {
    return (
      this.services.world.level &&
      !this.services.world.gameState.gamePaused &&
      !this.services.character.hp <= 0
    );
  }

  /**
   * Checks and handles all possible collisions with enemies.
   * Uses spatial partitioning for performance optimization.
   */
  checkCollisionsWithEnemies() {
    if (!this.services.world.level?.enemies) return;

    let enemies = this.services.world.level.enemies;
    this.processEnemyCollisions(enemies);
  }

  /**
   * Processes collisions for an array of enemies
   * @param {Enemy[]} enemies - Array of enemies to check
   */
  processEnemyCollisions(enemies) {
    enemies.forEach((enemy) => {
      if (!this.isObjectInCollisionRange(this.services.character, enemy))
        return;

      let isEndboss = enemy.constructor.name === "Endboss";
      let isAboveGround = this.services.character.isAboveGround();

      this.handleCollisions(enemy, isAboveGround, isEndboss);
    });
  }

  /**
   * Handles different types of collisions between character and enemy
   * @param {Enemy} enemy - The enemy involved in the collision
   * @param {boolean} isAboveGround - Whether character is in air
   * @param {boolean} isEndboss - Whether enemy is the endboss
   */
  handleCollisions(enemy, isAboveGround, isEndboss) {
    if (isAboveGround) {
      if (this.isEndbossCollision(enemy, isEndboss)) {
        this.handleEndbossCollision(enemy);
      } else if (this.isNormalEnemyCollision(enemy)) {
        if (this.isCharacterFalling()) {
          this.handleGroundCollision(enemy, isEndboss);
        } else {
          this.handleJumpOnEnemy(enemy);
        }
      }
    } else {
      this.handleGroundCollision(enemy, isEndboss);
    }
  }

  /**
   * Checks if collision is with endboss
   * @param {Enemy} enemy - The enemy to check
   * @param {boolean} isEndboss - Whether enemy is the endboss
   * @returns {boolean} True if collision is with endboss
   */
  isEndbossCollision(enemy, isEndboss) {
    return isEndboss && this.services.character.isColliding(enemy);
  }

  /**
   * Checks if collision is with a normal enemy
   * @param {Enemy} enemy - The enemy to check
   * @returns {boolean} True if collision is with a normal enemy
   */
  isNormalEnemyCollision(enemy) {
    return !this.onAnEnemy && this.services.character.isColliding(enemy);
  }

  /**
   * Checks if character is falling
   * @returns {boolean} True if character is falling
   */
  isCharacterFalling() {
    return this.services.character.speedY <= 0;
  }

  /**
   * Checks if two objects are within both horizontal and vertical range.
   * @param {GameObject} character - First game object
   * @param {GameObject} enemy - Second game object
   * @returns {boolean} True if objects are within range
   */
  isObjectInCollisionRange(character, enemy) {
    let { horizontal, vertical } = this.collisionRanges;

    let isInHorizontalRange = this.isObjectInHorizontalRange(
      character,
      enemy,
      horizontal
    );
    if (!isInHorizontalRange) return false;

    let verticalDistance = Math.abs(character.y - enemy.y);
    return verticalDistance < vertical;
  }

  /**
   * Checks if two objects are within horizontal range.
   * @param {GameObject} character - First game object
   * @param {GameObject} enemy - Second game object
   * @param {number} range - Maximum horizontal distance
   * @returns {boolean} True if objects are within range
   */
  isObjectInHorizontalRange(character, enemy, range) {
    let horizontalDistance = Math.abs(character.x - enemy.x);
    return horizontalDistance < range;
  }

  /**
   * Checks if two objects are within a specified range of each other.
   * @param {GameObject} character - First game object
   * @param {GameObject} enemy - Second game object
   * @param {number} [range=200] - Maximum distance between objects
   * @returns {boolean} True if objects are within range
   */
  isInRange(character, enemy, range = 200) {
    let horizontalDistance = character.x - enemy.x;
    if (Math.abs(horizontalDistance) > range) return false;
    let verticalDistance = character.y - enemy.y;
    return Math.abs(verticalDistance) < range;
  }

  /**
   * Handles endboss collision
   * @param {Enemy} enemy - The endboss involved in the collision
   */
  handleEndbossCollision(enemy) {
    if (this.damageImmune || !this.services.character.isColliding(enemy))
      return;

    this.applyEnemyCollisionEffects(enemy);
    this.services.character.knockBack(35);
    this.updateCameraAfterKnockBack();
  }

  /**
   * Handles jumping on different types of enemies
   * @param {Enemy} enemy - The enemy being jumped on
   */
  handleJumpOnEnemy(enemy) {
    const enemyType = enemy.constructor.name;
    const isValidEnemyType = ["Chicken", "SmallChicken"].includes(enemyType);

    if (isValidEnemyType && this.services.character.speedY >= 0) {
      this.activateJumpOnChicken(enemy);
      enemy.playDeathAnimation();
      this.sounds.playAudio(`${enemyType.toLowerCase()}_dead`);
    }
  }

  /**
   * Activates jump on chicken
   * @param {Enemy} enemy - The chicken involved in the jump
   */
  activateJumpOnChicken(enemy) {
    this.onAnEnemy = true;
    enemy.hit(20);
    this.services.character.currentImage = 1;
    this.services.character.speedY = -310;
  }

  /**
   * Resets the enemy jump state when character touches ground.
   */
  checkEnemyJumpState() {
    if (this.onAnEnemy && !this.services.character.isAboveGround()) {
      this.onAnEnemy = false;
    }
  }

  /**
   * Handles ground collision
   * @param {Enemy} enemy - The enemy involved in the collision
   * @param {boolean} isEndboss - Whether enemy is the endboss
   */
  handleGroundCollision(enemy, isEndboss) {
    if (this.damageImmune || !this.services.character.isColliding(enemy))
      return;

    if (this.services.character.isColliding(enemy)) {
      this.applyEnemyCollisionEffects(enemy, isEndboss);
      this.applayKnockBack(isEndboss);
    }
  }

  /**
   * Applies knockback to character
   * @param {boolean} isEndboss - Whether enemy is the endboss
   */
  applayKnockBack(isEndboss) {
    let knockBackStrength = isEndboss ? 25 : 7;
    this.services.character.knockBack(knockBackStrength);
    this.updateCameraAfterKnockBack();
  }

  /**
   * Updates camera position after character is knocked back
   */
  updateCameraAfterKnockBack() {
    let cameraInterval = setInterval(() => {
      this.services.character.updateCameraPosition();
    }, 5);

    setTimeout(() => {
      clearInterval(cameraInterval);
    }, 500);
  }

  /**
   * Applies standard effects when character collides with an enemy.
   * @param {Enemy} enemy - The enemy involved in the collision
   * @param {boolean} isEndboss - Whether enemy is the endboss
   */
  applyEnemyCollisionEffects(enemy, isEndboss) {
    let damage = isEndboss ? 40 : 20;
    this.services.character.hit(damage);
    this.services.character.characterFullHealth = false;
    this.canMoveRight = false;
    this.world.statusBars.character.setPercentage(this.services.character.hp);
    this.sounds.playAudio("character_hurt");
    if (isEndboss) {
      this.damageImmune = false;
    } else {
      this.damageImmune = true;
    }

    this.resetCharacterStateAfterDamage(isEndboss, enemy);
  }

  /**
   * Resets character's damage immunity and movement state after delay
   * @param {boolean} isEndboss - Whether the enemy is endboss
   * @param {Enemy} enemy - The enemy involved in collision
   */
  resetCharacterStateAfterDamage(isEndboss, enemy) {
    setTimeout(() => {
      this.canMoveRight = true;
      if (this.canResetDamageImmunity(isEndboss, enemy)) {
        this.damageImmune = false;
      }
    }, 1000);
  }

  /**
   * Checks if damage immunity can be reset
   * @param {boolean} isEndboss - Whether the enemy is endboss
   * @param {Enemy} enemy - The enemy involved in collision
   * @returns {boolean} True if immunity can be reset
   */
  canResetDamageImmunity(isEndboss, enemy) {
    return (
      !this.services.character.characterIsDead &&
      !(isEndboss && enemy.endbossIsDead)
    );
  }

  /**
   * Checks for bottle collisions with enemies and ground
   */
  checkIfBottleHit() {
    if (!this.services.bottleThrowManager.throwableBottles) return;

    this.services.bottleThrowManager.throwableBottles.forEach(
      (bottle, bottleId) => {
        this.checkBottleCollisionWithEnemies(bottle, bottleId);
        this.checkBottleCollisionWithGround(bottle, bottleId);
      }
    );
  }

  /**
   * Checks for bottle collisions with enemies
   * @param {Bottle} bottle - The bottle to check
   * @param {number} bottleId - ID of the bottle
   */
  checkBottleCollisionWithEnemies(bottle, bottleId) {
    for (
      let enemyIndex = this.world.level.enemies.length - 1;
      enemyIndex >= 0;
      enemyIndex--
    ) {
      let enemy = this.world.level.enemies[enemyIndex];
      if (!bottle.collided && bottle.isColliding(enemy)) {
        this.handleBottleEnemyCollision(bottle, bottleId, enemy);
      }
    }
  }

  /**
   * Checks for bottle collisions with the ground
   * @param {Bottle} bottle - The bottle to check
   * @param {number} bottleIndex - Index of the bottle
   */
  checkBottleCollisionWithGround(bottle, bottleIndex) {
    if (!bottle.collided && bottle.y > 340) {
      this.handleBottleCollision(bottle, bottleIndex);
    }
  }

  /**
   * Handles bottle collision with an enemy
   * @param {Bottle} bottle - The bottle involved in the collision
   * @param {number} bottleId - ID of the bottle
   * @param {Enemy} enemy - The enemy involved in the collision
   */
  handleBottleEnemyCollision(bottle, bottleId, enemy) {
    this.handleBottleCollision(bottle, bottleId);
    enemy.hit(10);
    this.playEnemySound(enemy);
    this.handleEnemyAfterCollision(enemy);
  }

  /**
   * Handles bottle collision
   * @param {Bottle} bottle - The bottle involved in the collision
   * @param {number} bottleId - ID of the bottle
   */
  handleBottleCollision(bottle, bottleId) {
    bottle.collided = true;
    bottle.speedY = 0;
    bottle.acceleration = 0;
    this.sounds.playAudio("bottle_splash");
    bottle.onSplashComplete = () => this.removeBottle(bottleId);
  }

  /**
   * Plays appropriate sound effect for enemy hit by bottle
   * @param {Enemy} enemy - The enemy that was hit
   * @private
   */
  playEnemySound(enemy) {
    const soundMap = {
      Chicken: "chicken_dead",
      SmallChicken: "smallchicken_dead",
      Endboss: enemy.hp <= 0 ? "endboss_dead" : "endboss_hurt",
    };

    const enemyType = enemy.constructor.name;
    const soundEffect = soundMap[enemyType];

    if (soundEffect) {
      this.sounds.playAudio(soundEffect);
    }
  }

  /**
   * Removes a bottle from the throwable bottles list
   * @param {number} bottleId - ID of the bottle to remove
   */
  removeBottle(bottleId) {
    this.services.bottleThrowManager.throwableBottles.delete(bottleId);
  }

  /**
   * Handles enemy after collision
   * @param {Enemy} enemy - The enemy involved in the collision
   */
  handleEnemyAfterCollision(enemy) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      enemy.playDeathAnimation();
    } else if (enemy instanceof Endboss) {
      this.services.endbossHpBar.setPercentage(enemy.hp);
    }
  }
}
