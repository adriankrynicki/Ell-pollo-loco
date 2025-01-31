class GameStateManager {
  // Class Fields
  pausedPositions = {};
  gameStateHandled = false;
  gameEndCallback = null;
  level;

  constructor(services) {
    this.services = services;
    this.world = services.world;
    this.gameState = this.world.gameState;
    this.sounds = services.sounds;
    this.bottleThrowManager = services.bottleThrowManager;
    this.collisionHandler = services.collisionHandler;
    this.animationManager = services.animationManager;
    this.screenManager = services.screenManager;
  }

  // Neue Methode zum Initialisieren der abhängigen Services
  initialize(level) {
    this.level = level;
    this.endboss = this.getEndboss();

    // Erst jetzt Animationen hinzufügen
    this.addAnimations();
  }

  addAnimations() {
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (this.level) {
          this.checkWinOrLose();
        }
      }
    });
  }

  getEndboss() {
    return this.level?.enemies?.find(enemy => enemy instanceof Endboss);
  }

  pauseGame() {
    this.services.world.gameState.gamePaused = true;
    this.saveCurrentPositions();
    this.sounds.pauseAudio("background_music");
    this.sounds.pauseAudio("snoring");
  }

  resumeGame() {
    this.restorePositions();
    this.services.world.gameState.gamePaused = false;
    this.sounds.playAudio("background_music");
    if (this.services.character.isSleeping) {
      this.sounds.playAudio("snoring");
    }
  }

  saveCurrentPositions() {
    this.saveCharacterPosition();
    this.saveEnemyPositions();
    this.saveBottlePositions();
  }

  saveCharacterPosition() {
    this.pausedPositions.character = {
      x: this.services.character.x,
      y: this.services.character.y,
      speedX: this.services.character.speedX,
      speedY: this.services.character.speedY,
    };
  }

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

  saveBottlePositions() {
    this.pausedPositions.bottles = Array.from(
      this.bottleThrowManager.throwableBottles.values()
    ).map((bottle) => ({
      x: bottle.x,
      y: bottle.y,
      speedX: bottle.speedX,
      speedY: bottle.speedY,
    }));
  }

  restorePositions() {
    this.restoreCharacterPosition();
    this.restoreEnemyPositions();
    this.restoreBottlePositions();
  }

  restoreCharacterPosition() {
    if (this.pausedPositions.character) {
      this.services.character.x = this.pausedPositions.character.x;
      this.services.character.y = this.pausedPositions.character.y;
      this.services.character.speedX = this.pausedPositions.character.speedX;
      this.services.character.speedY = this.pausedPositions.character.speedY;
    }
  }

  restoreEnemyPositions() {
    this.pausedPositions.enemies?.forEach((pos) => {
      const enemy = this.level.enemies.find(
        (e) => e.number === pos.number && e.constructor.name === pos.type
      );
      if (enemy) this.enemyPosition(enemy, pos);
    });
  }

  enemyPosition(enemy, pos) {
    if (!enemy) return;

    enemy.x = pos.x;
    enemy.y = pos.y;
    enemy.speedX = pos.speedX;
    enemy.speedY = pos.speedY;
  }

  restoreBottlePositions() {
    this.pausedPositions.bottles?.forEach((pos, index) => {
      const bottles = Array.from(
        this.bottleThrowManager.throwableBottles.values()
      );
      if (bottles[index]) {
        bottles[index].x = pos.x;
        bottles[index].y = pos.y;
        bottles[index].speedX = pos.speedX;
        bottles[index].speedY = pos.speedY;
      }
    });
  }

  checkWinOrLose() {
    if (this.services.character.hp < 20) {
      if (this.services.character.hp <= 0 && !this.services.character.characterIsDead) {
        this.handleLoseSound();
        this.collisionHandler.damageImmune = true;
      }
    } else if (this.services.character.isInBossArea) {
      
      if (this.endboss.hp <= 0 && !this.endboss.endbossIsDead) {
        this.handleWinSound();
        this.collisionHandler.damageImmune = true;
      }
    }
  }

  handleLoseSound() {
    this.services.world.gameState.gameLost = true;
    this.services.character.characterIsDead = true;

    this.handleGameOver();
    this.sounds.playAudio("character_dead");
    setTimeout(() => {
      this.sounds.playAudio("lose");
    }, 1000);

    if (this.gameEndCallback) {
      this.gameEndCallback({
        won: false,
        finalTime: document.getElementById("time-container").innerHTML,
      });
    }
  }

  handleWinSound() {
    this.services.world.gameState.gameWon = true;
    this.endboss.endbossIsDead = true;
    
    this.handleGameOver();
    setTimeout(() => {
      this.sounds.playAudio("win");
    }, 800);

    if (this.gameEndCallback) {
      this.gameEndCallback({
        won: true,
        finalTime: document.getElementById("time-container").innerHTML,
      });
    }
  }

  handleGameOver() {
    this.sounds.pauseAudio("background_music");
    document.dispatchEvent(new CustomEvent("gameOver"));

    setTimeout(() => {
      
      this.pauseGame();

      this.sounds.toggleGameSounds(true);
      this.sounds.toggleMusic(true);
    }, 3000);
  }

  setGameEndCallback(callback) {
    this.gameEndCallback = callback;
  }
}
