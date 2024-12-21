class World {
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  bottleStatusbar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  canMoveRight = true;
  gamePaused = false;
  gameWon = false;
  gameLost = false;
  onGameEnd = null;
  gameStateHandled = false;
  lastCheck = 0;
  checkInterval = 50; // 50ms zwischen Checks

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.sounds = new Sounds(false);
    this.character = new Character(this);
    this.characterHPBar = new CharacterHPBar();
    this.endbossHpBar = new EndbossHpBar();
    this.endboss = null;
    this.level = null;
    this.gameStateManager = new GameStateManager(this);
    this.collisionHandler = new CollisionHandler(this);
    this.winImage = new Image();
    this.loseImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/win/won_2.png";
    this.loseImage.src = "img/9_intro_outro_screens/game_over/game over.png";
    this.bottleManager = new BottleManager(this);
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  setLevel(level) {
    this.level = level;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.draw();
  }

  draw() {
    if (this.gamePaused) {
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.allintervals();

    this.clearCanvas();

    this.backgroundObjects();
    this.movableObjects();
    this.drawStatusBars();
    this.displayEndbossHpBar();

    this.drawEndScreen();

    this.gameEndState();

    requestAnimationFrame(() => this.draw());
  }

  allintervals() {
    const currentTime = performance.now();

    if (currentTime - this.lastCheck >= this.checkInterval) {
      this.runBasicChecks();
      this.runBottleActions();
      this.runJumpActions();

      this.lastCheck = currentTime;
    }
  }

  runBasicChecks() {
    this.checkCollisionsWithEnemies();
    this.checkCollectedBottles();
    this.checkCollectedCoins();
    this.checkWinOrLose();
  }

  runBottleActions() {
    this.bottleManager.checkBottleThrow();
    this.bottleManager.checkIfBottleHit();
  }

  runJumpActions() {
    this.collisionHandler.handleJumpOnChicken();
    this.collisionHandler.handleJumpOnSmallChicken();
    this.collisionHandler.checkCharacterAfterJumpOnAnEnemy();
  }

  pauseGame() {
    this.gameStateManager.pauseGame();
  }

  resumeGame() {
    this.gameStateManager.resumeGame();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  backgroundObjects() {
    if (!this.level) return;
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObject);
    this.addObjectToMap(this.level.collectableBottles);
    this.addObjectToMap(this.level.collectableCoins);
    this.ctx.translate(-this.camera_x, 0);
  }

  movableObjects() {
    if (!this.level) return;
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectToMap(this.level.enemies);
    this.bottleManager.drawBottles();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawStatusBars() {
    this.addToMap(this.characterHPBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusbar);
    if (this.showEndbossHpBar) {
      this.addToMap(this.endbossHpBar);
    }
  }

  displayEndbossHpBar() {
    if (this.character.x > 1600) {
      this.showEndbossHpBar = true;
    }
  }

  drawEndScreen() {
    if (this.gameWon) {
      this.drawWinScreen();
    } else if (this.gameLost) {
      this.drawGameOverScreen();
    }
  }

  gameEndState() {
    if (!this.gameStateHandled && (this.gameWon || this.gameLost)) {
      this.gameStateHandled = true;
      this.onGameEnd?.(this.gameWon ? "won" : "lost");
    }
  }

  addObjectToMap(object) {
    object.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.OtherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.OtherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  drawWinScreen() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const newWidth = this.winImage.width * 0.5;
    const newHeight = this.winImage.height * 0.5;

    const x = (this.canvas.width - newWidth) / 2;
    const y = (this.canvas.height - newHeight) / 2;

    this.ctx.drawImage(this.winImage, x, y, newWidth, newHeight);
  }

  drawGameOverScreen() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const newWidth = this.loseImage.width * 0.5;
    const newHeight = this.loseImage.height * 0.5;
    const x = (this.canvas.width - newWidth) / 2;
    const y = (this.canvas.height - newHeight) / 2;

    this.ctx.drawImage(this.loseImage, x, y, newWidth, newHeight);
  }

  checkCollisionsWithEnemies() {
    this.collisionHandler.checkCollisionsWithEnemies();
  }

  checkCharacterAfterJumpOnAnEnemy() {
    this.collisionHandler.checkCharacterAfterJumpOnAnEnemy();
  }

  handleJumpOnEnemies() {
    this.collisionHandler.handleJumpOnChicken();
    this.collisionHandler.handleJumpOnSmallChicken();
  }

  checkCollectedBottles() {
    this.level.collectableBottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.bottleManager.bottleCollected++;
        bottle.bottleCollectSound();
        this.deleteBottle(bottle);
        this.bottleStatusbar.setPercentage(this.bottleManager.bottleCollected * 10);
      }
    });
  }

  checkCollectedCoins() {
    this.level.collectableCoins.forEach((coin) => {
      if (this.character.isCollected(coin)) {
        this.coinsCollected++;
        coin.coinSound();
        this.deleteCoin(coin);
        this.coinStatusBar.setPercentage(this.coinsCollected * 10);
      } else if (this.coinsCollected >= 20) {
        this.character.hp++;
        this.characterHPBar.setPercentage(this.character.hp);
        if (this.character.hp >= 100 && this.coinsCollected >= 20) {
          this.coinsCollected = 0;
        }
      }
    });
  }

  deleteBottle(bottle) {
    let index = this.level.collectableBottles.indexOf(bottle);
    if (index > -1) {
      this.level.collectableBottles.splice(index, 1);
      this.draw();
    }
  }

  deleteCoin(coin) {
    let index = this.level.collectableCoins.indexOf(coin);
    if (index > -1) {
      this.level.collectableCoins.splice(index, 1);
      this.draw();
    }
  }

  checkWinOrLose() {
    if (this.character.hp <= 0 && !this.characterIsDead) {
      this.handleWinSound();
    } else if (this.endboss.hp <= 0 && !this.endbossIsDead) {
      this.handleLoseSound();
    }
  }

  handleWinSound() {
    this.gameLost = true;
    this.characterIsDead = true;
    this.handleGameOver();
    this.sounds.playAudio("character_dead");
    setTimeout(() => {
      this.sounds.playAudio("lose");
    }, 1000);
    document.dispatchEvent(
      new CustomEvent("gameStateChange", {
        detail: { state: "lost" },
      })
    );
  }

  handleLoseSound() {
    this.gameWon = true;
    this.endbossIsDead = true;
    this.handleGameOver();
    this.sounds.playAudio("endboss_dead");
    setTimeout(() => {
      this.sounds.playAudio("win");
    }, 800);
    document.dispatchEvent(
      new CustomEvent("gameStateChange", {
        detail: { state: "won" },
      })
    );
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
    this.onGameEnd = callback;
  }
}
