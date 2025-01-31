/**
 * Handles all collision detection and resolution in the game.
 * @class
 */
class CollisionHandler {
  // State Management
  onAnEnemy = false;
  damageImmune = false;
  canMoveRight = true;

  /** @type {Object} Defines collision detection ranges */
  collisionRanges = {
    horizontal: 300,
    vertical: 370,
  };

  constructor(services) {
    this.services = services;
    this.canvas = services.canvas;
    this.ctx = services.ctx;
    this.world = services.world;
    this.keyboard = services.keyboard;
    this.sounds = services.sounds;
    this.animationManager = services.animationManager;
  }

  initialize(level) {
    this.services.world.level = level;

    // Animation erst nach Level-Initialisierung hinzufügen
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (
          this.services.world.level &&
          !this.services.world.gameState.gamePaused &&
          !this.services.character.hp <= 0
        ) {
          this.checkCollisionsWithEnemies();
          this.checkEnemyJumpState();
          this.checkIfBottleHit();
        }
      },
    });
  }

  /**
   * Checks and handles all possible collisions with enemies.
   * Uses spatial partitioning for performance optimization.
   */
  checkCollisionsWithEnemies() {
    if (!this.world.level?.enemies) return; // Early return wenn keine enemies

    const enemies = this.world.level.enemies;

    enemies.forEach((enemy) => {
      if (!this.isObjectInCollisionRange(this.services.character, enemy))
        return;

      let isEndboss = enemy.constructor.name === "Endboss";
      let isAboveGround = this.services.character.isAboveGround();

      this.handleCollisions(enemy, isAboveGround, isEndboss);
    });
  }

  handleCollisions(enemy, isAboveGround, isEndboss) {
    if (isAboveGround) {
      if (isEndboss && this.services.character.isColliding(enemy)) {
        this.handleEndbossCollision(enemy);
      } else if (
        this.services.character.isColliding(enemy) &&
        !this.onAnEnemy
      ) {
        if (this.services.character.speedY <= 0) {
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
   * Checks if two objects are within both horizontal and vertical range.
   * @param {GameObject} character - First game object
   * @param {GameObject} enemy - Second game object
   * @returns {boolean} True if objects are within range
   * @private
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
   * @private
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

  handleEndbossCollision(enemy) {
    if (this.damageImmune || !this.services.character.isColliding(enemy))
      return;

    this.applyEnemyCollisionEffects(enemy);
    this.services.character.endbossKick();
    this.updateCameraAfterKick();
  }

  handleJumpOnEnemy(enemy) {
    let isChicken = enemy.constructor.name === "Chicken";
    let isSmallChicken = enemy.constructor.name === "SmallChicken";
    if (isChicken && this.services.character.speedY >= 0) {
      this.activateJumpOnChicken(enemy);
      enemy.playDeathAnimation();
      this.sounds.playAudio("chicken_dead");
    } else if (isSmallChicken && this.services.character.speedY >= 0) {
      this.activateJumpOnChicken(enemy);
      enemy.playDeathAnimation();
      this.sounds.playAudio("small_chicken_dead");
    }
  }

  activateJumpOnChicken(enemy) {
    this.onAnEnemy = true;
    enemy.hit(20);
    this.services.character.currentImage = 1;
    this.services.character.speedY = -310;
  }

  /**
   * Resets the enemy jump state when character touches ground.
   * @private
   */
  checkEnemyJumpState() {
    if (this.onAnEnemy && !this.services.character.isAboveGround()) {
      this.onAnEnemy = false;
    }
  }

  handleGroundCollision(enemy, isEndboss) {
    if (this.damageImmune || !this.services.character.isColliding(enemy))
      return;

    if (this.services.character.isColliding(enemy)) {
      this.applyEnemyCollisionEffects(enemy, isEndboss);
      if (isEndboss) {
        this.services.character.endbossKick();
        this.updateCameraAfterKick();
      } else {
        this.services.character.enemyKick();
        this.updateCameraAfterKick();
      }
    }
  }

  updateCameraAfterKick() {
    let cameraInterval = setInterval(() => {
      this.services.character.updateCameraPosition();
    }, 5);

    setTimeout(() => {
      clearInterval(cameraInterval);
    }, 500);
  }

  /**
   * Applies standard effects when character collides with an enemy.
   */
  applyEnemyCollisionEffects(enemy, isEndboss) {
    if (isEndboss) {
      this.services.character.hit(50);
    } else {
      this.services.character.hit(20);
    }

    this.damageImmune = true;
    this.canMoveRight = false;
    this.world.statusBars.character.setPercentage(this.services.character.hp);
    this.sounds.playAudio("character_hurt");

    setTimeout(() => {
      this.canMoveRight = true;
      if (
        !this.services.character.characterIsDead &&
        !(isEndboss && enemy.endbossIsDead)
      ) {
        this.damageImmune = false;
      }
    }, 1000);
  }

  checkIfBottleHit() {
    if (!this.services.bottleThrowManager.throwableBottles) return;

    this.services.bottleThrowManager.throwableBottles.forEach(
      (bottle, bottleId) => {
        this.checkBottleCollisionWithEnemies(bottle, bottleId);
        this.checkBottleCollisionWithGround(bottle, bottleId);
      }
    );
  }

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

  checkBottleCollisionWithGround(bottle, bottleIndex) {
    if (!bottle.collided && bottle.y > 340) {
      this.handleBottleCollision(bottle, bottleIndex);
    }
  }

  handleBottleEnemyCollision(bottle, bottleId, enemy) {
    this.handleBottleCollision(bottle, bottleId);
    enemy.bottledamage();
    this.playEnemySound(enemy);
    this.handleEnemyAfterCollision(enemy);
  }

  handleBottleCollision(bottle, bottleId) {
    bottle.collided = true;
    bottle.speedY = 0;
    bottle.acceleration = 0;
    this.sounds.playAudio("bottle_splash");
    bottle.onSplashComplete = () => this.removeBottle(bottleId);
  }

  playEnemySound(enemy) {
    if (enemy instanceof Chicken) {
      this.sounds.playAudio("chicken_dead");
    } else if (enemy instanceof SmallChicken) {
      this.sounds.playAudio("small_chicken_dead");
    } else if (enemy instanceof Endboss) {
      if (enemy.hp <= 0) {
        this.sounds.playAudio("endboss_dead");
      } else {
        this.sounds.playAudio("endboss_hurt");
      }
    }
  }

  removeBottle(bottleId) {
    this.services.bottleThrowManager.throwableBottles.delete(bottleId);
  }

  handleEnemyAfterCollision(enemy) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      enemy.playDeathAnimation();
    } else if (enemy instanceof Endboss) {
      this.services.endbossHpBar.setPercentage(enemy.hp);
    }
  }
}
