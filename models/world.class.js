class World {
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  bottleStatusbar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  throwableBottles = new Map();
  bottleCollected = 0;
  coinsCollected = 0;
  canMoveRight = true;
  level = null;
  gamePaused = false;
  gameWon = false;
  gameLost = false;
  keyDPressed = false;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.sounds = new Sounds(false);
    this.character = new Character(this);
    this.characterHPBar = new CharacterHPBar();
    this.endbossHpBar = new EndbossHpBar();
    this.endboss = null;
    this.gameStateManager = new GameStateManager(this);
    this.collisionHandler = new CollisionHandler(this);
    this.winImage = new Image();
    this.loseImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/win/won_2.png";
    this.loseImage.src = "img/9_intro_outro_screens/game_over/game over.png";
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  setLevel(level) {
    this.level = level;
    this.endboss = this.level.enemies.find((e) => e instanceof Endboss);
    this.draw();
    this.run();
  }

  run() {
    setInterval(() => {
      if (!this.gamePaused) {
        this.checkThrowObject();
        this.checkIfBottleHit();
        this.checkCollisionsWithEnemies();
        this.checkCollisionFromAbove();
        this.checkCollectedBottles();
        this.checkCollectedCoins();
        this.checkCharacterAfterJumpOnAnEnemy();
        this.checkWinOrLose();
        console.log(this.character.hp);
      }
    }, 50);
  }

  draw() {
    if (this.gamePaused) {
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.clearCanvas();

    this.backgroundObjects();
    this.movableObjects();
    this.drawStatusBars();
    this.displayEndbossHpBar();

    if (this.gameWon) {
      this.drawWinScreen();
    } else if (this.gameLost) {
      this.drawGameOverScreen();
    }

    requestAnimationFrame(() => this.draw());
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
    this.addObjectToMap(this.throwableBottles);
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
    // Hintergrund
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Bildgröße auf 50% reduzieren
    const newWidth = this.winImage.width * 0.5; // 50% der originalen Breite
    const newHeight = this.winImage.height * 0.5; // 50% der originalen Höhe

    // Bild zentrieren mit neuer Größe
    const x = (this.canvas.width - newWidth) / 2;
    const y = (this.canvas.height - newHeight) / 2;

    this.ctx.drawImage(this.winImage, x, y, newWidth, newHeight);
  }

  drawGameOverScreen() {
    // Hintergrund
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Bildgröße auf 50% reduzieren
    const newWidth = this.loseImage.width * 0.5; // 50% der originalen Breite
    const newHeight = this.loseImage.height * 0.5; // 50% der originalen Höhe

    // Bild zentrieren mit neuer Größe
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

  checkCollisionFromAbove() {
    this.collisionHandler.checkCollisionFromAbove();
  }

  checkCollectedBottles() {
    this.level.collectableBottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.bottleCollected++;
        bottle.bottleCollectSound();
        this.deleteBottle(bottle);
        this.bottleStatusbar.setPercentage(this.bottleCollected * 10);
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

  checkThrowObject() {
    if (this.bottleThrowCondition()) {
      this.bottleCollected--;
      this.bottleStatusbar.setPercentage(this.bottleCollected * 10);
      const bottle = new ThrowableBottles(
        this.character.x + 30,
        this.character.y + 100
      );
      const bottleId = Date.now();
      this.throwableBottles.set(bottleId, bottle);
      this.sounds.playAudio("bottle_throw");
      this.keyDPressed = true;
      this.character.bottleThrow = true;
      this.character.toggleBottleThrow();
    } else if (!this.keyboard.D) {
      this.keyDPressed = false;
      this.character.bottleThrow = false;
    }
  }

  bottleThrowCondition() {
    return (
      this.keyboard.D &&
      !this.keyDPressed &&
      this.throwableBottles.size === 0 &&
      this.bottleCollected > 0
    );
  }

  checkIfBottleHit() {
    for (const [bottleId, bottle] of this.throwableBottles.entries()) {
      this.checkBottleCollisionWithEnemies(bottle, bottleId);
      this.checkBottleCollisionWithGround(bottle, bottleId);
    }
  }

  checkBottleCollisionWithEnemies(bottle, bottleId) {
    for (
      let enemyIndex = this.level.enemies.length - 1;
      enemyIndex >= 0;
      enemyIndex--
    ) {
      let enemy = this.level.enemies[enemyIndex];
      if (!bottle.collided && bottle.isColliding(enemy)) {
        this.handleBottleEnemyCollision(bottle, bottleId, enemy);
      }
    }
  }

  checkBottleCollisionWithGround(bottle, bottleIndex) {
    if (!bottle.collided && bottle.y > 340) {
      this.handleBottleCollisionWithGround(bottle, bottleIndex);
    }
  }

  handleBottleEnemyCollision(bottle, bottleId, enemy) {
    this.markBottleAsCollided(bottle, bottleId);
    this.applyDamageToEnemy(enemy);
    this.playEnemySound(enemy);
    this.handleEnemyAfterCollision(enemy);
  }

  handleEnemyAfterCollision(enemy) {
    if (enemy instanceof Chicken) {
      this.deleteChicken(enemy);
    } else if (enemy instanceof SmallChicken) {
      this.deleteChicken(enemy);
    } else if (enemy instanceof Endboss) {
      this.endbossHpBar.setPercentage(enemy.hp);
    }
  }

  handleBottleCollisionWithGround(bottle, bottleIndex) {
    bottle.collided = true;
    bottle.stopThrow();
    bottle.bottleSplashSound();
    bottle.bottleSplash(() => this.removeBottle(bottleIndex));
  }

  markBottleAsCollided(bottle, bottleId) {
    bottle.collided = true;
    bottle.stopThrow();
    bottle.bottleSplashSound();
    bottle.bottleSplash(() => this.removeBottle(bottleId));
  }

  playEnemySound(enemy) {
    if (enemy instanceof Chicken) {
      enemy.deadChickenSound();
    } else if (enemy instanceof SmallChicken) {
      enemy.deadSmallChickenSound();
    } else if (enemy instanceof Endboss) {
      enemy.endbossHurtSound();
    }
  }

  applyDamageToEnemy(enemy) {
    enemy.bottledamage();
  }

  removeBottle(bottleId) {
    this.throwableBottles.delete(bottleId);
  }

  deleteChicken(enemy) {
    setTimeout(() => {
      let index = this.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.level.enemies.splice(index, 1);
        this.draw();
      }
    }, 350);
  }

  checkWinOrLose() {
    if (this.character.hp <= 0) {
      this.gameLost = true;
      this.sounds.pauseAudio("background_music");
      this.sounds.playAudio("lose");
      setTimeout(() => {
        this.pauseGame();
      }, 1000);
    } else if (this.endboss.hp <= 0) {
      this.gameWon = true;
      this.sounds.pauseAudio("background_music");
      this.sounds.playAudio("win");
      setTimeout(() => {
        this.pauseGame();
      }, 1000);
    }
  }
}
