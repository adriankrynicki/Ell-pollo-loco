class World {
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  characterHPBar = new CharacterHPBar();
  endbossHpBar = new EndbossHpBar();
  bottleStatusbar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  throwableBottles = new Map();
  bottleCollected = 0;
  coinsCollected = 0;
  canMoveRight = true;
  onAnEnemy = false;
  level = null;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.sounds = new Sounds(false);
    this.character = new Character(this);
    this.endboss = new Endboss(this);
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkThrowObject();
      this.checkIfBottleHit();
      this.checkCollisionsWithEnemies();
      this.checkCollisionFromAbove();
      this.checkCollectedBottles();
      this.checkCollectedCoins();
      this.checkCharacterAfterJumpOnAnEnemy();
    }, 50);
  }

  checkCharacterAfterJumpOnAnEnemy() {
    if (!this.character.isAboveGround()) {
      this.onAnEnemy = false;
    }
  }

  checkCollisionFromAbove() {
    this.level.enemies.forEach((enemy) => {
      this.checkChickenCollision(enemy);
      this.checkSmallChickenCollision(enemy);
    });
  }

  checkChickenCollision(enemy) {
    if (
      enemy instanceof Chicken &&
      this.character.isColliding(enemy) &&
      this.character.isAboveGround() &&
      !(enemy instanceof Endboss) &&
      this.character.speedY > 10
    ) {
      this.handleChickenCollision(enemy);
    }
  }

  checkSmallChickenCollision(enemy) {
    if (
      enemy instanceof SmallChicken &&
      this.character.isColliding(enemy) &&
      this.character.isAboveGround() &&
      !(enemy instanceof Endboss) &&
      this.character.speedY > 10
    ) {
      this.handleSmallChickenCollision(enemy);
    }
  }

  handleChickenCollision(enemy) {
    if (!this.onAnEnemy) {
      this.onAnEnemy = true;
      enemy.hit();
      enemy.deadChickenSound();
      this.character.speedY = -20;
      this.character.jumpSound();
      this.deleteChicken(enemy);
    }
  }

  handleSmallChickenCollision(enemy) {
    if (!this.onAnEnemy) {
      this.onAnEnemy = true;
      enemy.hit();
      enemy.deadSmallChickenSound();
      this.character.speedY = -20;
      this.character.jumpSound();
      this.deleteChicken(enemy);
    }
  }

  checkCollisionsWithEnemies() {
    this.level.enemies.forEach((enemy) => {
      this.handleCollisionsWithEnemies(enemy);
    });
  }

  handleCollisionsWithEnemies(enemy) {
    if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
      this.handleEnemyCollisionOnGround(enemy);
    } else if (
      enemy instanceof Endboss &&
      this.character.isCollidingWithEndbossAboveGround(enemy) &&
      this.character.isAboveGround()
    ) {
      this.handleEndbossCollisionAboveGround();
    }
  }

  handleEnemyCollisionOnGround(enemy) {
    if (
      enemy instanceof Endboss &&
      this.character.isCollidingWithEndbossOnGround(enemy)
    ) {
      this.handleEndbossCollisionOnGround();
    }
    this.character.hit();
    this.characterHPBar.setPercentage(this.character.hp);
    this.character.characterHurtSound();
  }

  handleEndbossCollisionOnGround() {
    this.canMoveRight = false;
    this.character.Endbosskick();
    setTimeout(() => {
      this.canMoveRight = true;
    }, 1000);
  }

  handleEndbossCollisionAboveGround() {
    this.canMoveRight = false;
    this.character.Endbosskick();
    setTimeout(() => {
      this.canMoveRight = true;
    }, 1000);
    this.character.hit();
    this.characterHPBar.setPercentage(this.character.hp);
    this.character.characterHurtSound();
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

  deleteBottle(bottle) {
    let index = this.level.collectableBottles.indexOf(bottle);
    if (index > -1) {
      this.level.collectableBottles.splice(index, 1);
      this.draw();
    }
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

  deleteCoin(coin) {
    let index = this.level.collectableCoins.indexOf(coin);
    if (index > -1) {
      this.level.collectableCoins.splice(index, 1);
      this.draw();
    }
  }

  checkThrowObject() {
    if (
      this.keyboard.D &&
      !this.spacebarPressed &&
      this.throwableBottles.size === 0 &&
      this.bottleCollected > 0
    ) {
      this.bottleCollected--;
      this.bottleStatusbar.setPercentage(this.bottleCollected * 10);
      const bottle = new ThrowableBottles(
        this.character.x + 30,
        this.character.y + 100
      );
      const bottleId = Date.now();
      this.throwableBottles.set(bottleId, bottle);
      this.sounds.playAudio("bottle_throw");
      this.spacebarPressed = true;
    } else if (!this.keyboard.D) {
      this.spacebarPressed = false;
    }
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

  handleBottleEnemyCollision(bottle, bottleId, enemy) {
    this.markBottleAsCollided(bottle, bottleId);
    this.applyDamageToEnemy(enemy);
    this.playEnemySound(enemy);
    this.handleEnemyAfterCollision(enemy);
  }

  markBottleAsCollided(bottle, bottleId) {
    bottle.collided = true;
    bottle.stopThrow();
    bottle.bottleSplashSound();
    bottle.bottleSplash(() => this.removeBottle(bottleId));
  }

  applyDamageToEnemy(enemy) {
    enemy.bottledamage();
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

  handleEnemyAfterCollision(enemy) {
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      this.deleteChicken(enemy);
    } else if (enemy instanceof Endboss) {
      this.endbossHpBar.setPercentage(enemy.hp);
    }
  }

  removeBottle(bottleId) {
    this.throwableBottles.delete(bottleId);
  }

  checkBottleCollisionWithGround(bottle, bottleIndex) {
    if (!bottle.collided && bottle.y > 340) {
      this.handleBottleCollisionWithGround(bottle, bottleIndex);
    }
  }

  handleBottleCollisionWithGround(bottle, bottleIndex) {
    bottle.collided = true;
    bottle.stopThrow();
    bottle.bottleSplashSound();
    bottle.bottleSplash(() => this.removeBottle(bottleIndex));
  }

  deleteChicken(enemy) {
    setTimeout(() => {
      let index = this.level.enemies.indexOf(enemy);
      if (index > -1) {
        this.level.enemies.splice(index, 1);
        this.draw();
      }
    }, 500);
  }

  draw() {
    this.clearCanvas();
    this.backgroundObjects();
    this.movableObjects();
    this.drawStatusBars();
    this.displayEndbossHpBar();

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
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

  setLevel(level) {
    this.level = level;
    this.draw();
    this.run();
  }
}
