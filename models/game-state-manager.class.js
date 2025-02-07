/**
 * Manages the game state, including pause/resume functionality, position tracking,
 * and game end conditions.
 */
class GameStateManager {
  /**
   * Stores positions of game entities when game is paused
   * @type {Object.<string, any>}
   */
  pausedPositions = {};
  /**
   * Callback function to be called when the game ends
   * @type {Function}
   */
  gameEndCallback = null;
  /**
   * Reference to the current level
   * @type {Level}
   */
  level;

  /**
   * Constructor for GameStateManager
   * @param {Object} services - Services object containing various game components
   */
  constructor(services) {
    this.services = services;
    this.sounds = services.sounds;
    this.animationManager = services.animationManager;
  }

  /**
   * Initializes the game state manager
   * @param {Level} level - The current level
   */
  initialize(level) {
    this.level = level;
    this.endboss = this.getEndboss();

    this.startCheck();
  }

  /**
   * Adds the game state animation
   */
  startCheck() {
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (this.level) {
          this.checkWinOrLose();
        }
      },
    });
  }

  /**
   * Retrieves the endboss from the level
   * @returns {Endboss} The endboss instance
   */
  getEndboss() {
    return this.level?.enemies?.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Pauses the game and saves the current positions
   */
  pauseGame() {
    this.services.world.gameState.gamePaused = true;
    this.saveCurrentPositions();
    this.sounds.pauseAudio("background_music");
    this.sounds.pauseAudio("snoring");
  }

  /**
   * Resumes the game and restores the saved positions
   */
  resumeGame() {
    this.restorePositions();
    this.services.world.gameState.gamePaused = false;
    this.sounds.playAudio("background_music");
    if (this.services.character.isSleeping) {
      this.sounds.playAudio("snoring");
    }
  }

  /**
   * Saves the current positions of the character, enemies, and bottles
   */
  saveCurrentPositions() {
    this.saveCharacterPosition();
    this.saveEnemyPositions();
    this.saveBottlePositions();
  }

  /**
   * Saves the current position of the character
   */
  saveCharacterPosition() {
    this.pausedPositions.character = {
      x: this.services.character.x,
      y: this.services.character.y,
      speedX: this.services.character.speedX,
      speedY: this.services.character.speedY,
    };
  }

  /**
   * Saves the current positions of the enemies
   */
  saveEnemyPositions() {
    this.pausedPositions.enemies = this.level.enemies.map((enemy) => ({
      number: enemy.number,
      type: enemy.constructor.name,
      x: enemy.x,
      y: enemy.y,
      speedX: enemy.speedX,
      speedY: enemy.speedY,
    }));
  }

  /**
   * Saves the current positions of the bottles
   */
  saveBottlePositions() {
    this.pausedPositions.bottles = Array.from(
      this.services.bottleThrowManager.throwableBottles.values()
    ).map((bottle) => ({
      x: bottle.x,
      y: bottle.y,
      speedX: bottle.speedX,
      speedY: bottle.speedY,
    }));
  }

  /**
   * Restores the saved positions of the character, enemies, and bottles
   */
  restorePositions() {
    this.restoreCharacterPosition();
    this.restoreEnemyPositions();
    this.restoreBottlePositions();
  }

  /**
   * Restores the saved position of the character
   */
  restoreCharacterPosition() {
    if (this.pausedPositions.character) {
      this.services.character.x = this.pausedPositions.character.x;
      this.services.character.y = this.pausedPositions.character.y;
      this.services.character.speedX = this.pausedPositions.character.speedX;
      this.services.character.speedY = this.pausedPositions.character.speedY;
    }
  }

  /**
   * Restores the saved positions of the enemies
   */
  restoreEnemyPositions() {
    this.pausedPositions.enemies?.forEach((pos) => {
      const enemy = this.level.enemies.find(
        (e) => e.number === pos.number && e.constructor.name === pos.type
      );
      if (enemy) this.enemyPosition(enemy, pos);
    });
  }

  /**
   * Restores the saved position of an enemy
   * @param {Enemy} enemy - The enemy instance
   * @param {Object} pos - The saved position object
   */
  enemyPosition(enemy, pos) {
    if (!enemy) return;

    enemy.x = pos.x;
    enemy.y = pos.y;
    enemy.speedX = pos.speedX;
    enemy.speedY = pos.speedY;
  }

  /**
   * Restores the saved positions of the bottles
   */
  restoreBottlePositions() {
    this.pausedPositions.bottles?.forEach((pos, index) => {
      const bottles = Array.from(
        this.services.bottleThrowManager.throwableBottles.values()
      );
      if (bottles[index]) {
        bottles[index].x = pos.x;
        bottles[index].y = pos.y;
        bottles[index].speedX = pos.speedX;
        bottles[index].speedY = pos.speedY;
      }
    });
  }

  /**
   * Checks if the game has been won or lost
   */
  checkWinOrLose() {
    if (this.services.character.hp < 20) {
      if (
        this.services.character.hp <= 0 &&
        !this.services.character.characterIsDead
      ) {
        this.handleGameLost();
      }
    } else if (this.services.character.isInBossArea) {
      if (this.endboss.hp <= 0 && !this.endboss.endbossIsDead) {
        this.handleGameWon();
      }
    }
  }

  /**
   * Handles the game loss
   */
  handleGameLost() {
    this.setGameLostState();
    this.playGameLostSound();
    this.handleGameEnd(false);
  }

  /**
   * Sets the game lost state
   */
  setGameLostState() {
    this.services.collisionHandler.damageImmune = true;
    this.services.world.gameState.gameLost = true;
    this.services.character.characterIsDead = true;
  }

  /**
   * Plays the game lost sound
   */
  playGameLostSound() {
    setTimeout(() => {
      this.sounds.playAudio("lose");
    }, 1000);
  }

  /**
   * Handles the game win
   */
  handleGameWon() {
    this.setGameWonState();
    this.playGameWonSound();
    this.handleGameEnd(true);
  }

  /**
   * Sets the game won state
   */
  setGameWonState() {
    this.services.collisionHandler.damageImmune = true;
    this.services.world.gameState.gameWon = true;
    this.endboss.endbossIsDead = true;
  }

  /**
   * Plays the game won sound
   */
  playGameWonSound() {
    setTimeout(() => {
      this.sounds.playAudio("win");
    }, 800);
  }

  /**
   * Handles the game end
   * @param {boolean} isVictory - Indicates if the game was won
   */
  handleGameEnd(isVictory) {
    this.handleGameOver();

    if (this.gameEndCallback) {
      this.gameEndCallback({
        won: isVictory,
        finalTime: document.getElementById("time-container").innerHTML,
      });
    }
  }

  /**
   * Handles the game over state
   */
  handleGameOver() {
    this.sounds.pauseAudio("background_music");
    document.dispatchEvent(new CustomEvent("gameOver"));

    setTimeout(() => {
      this.pauseGame();
      this.sounds.toggleGameSounds(true);
      this.sounds.toggleMusic(true);
    }, 3000);
  }

  /**
   * Sets the callback function to be called when the game ends
   * @param {Function} callback - The callback function
   */
  setGameEndCallback(callback) {
    this.gameEndCallback = callback;
  }
}
