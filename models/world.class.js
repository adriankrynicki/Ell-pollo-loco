class World {
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  enemySpawnPoints = [];
  bottleStatusbar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  canMoveRight = true;
  gamePaused = false;
  gameWon = false;
  gameLost = false;
  onGameEnd = null;
  gameStateHandled = false;
  coinsCollected = 0;
  lastCheck = 0;
  checkInterval = 50;
  endbossBarActivated = false;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.endboss = null;
    this.level = null;
    this.sounds = new Sounds(false);
    this.character = new Character(this);
    this.characterHPBar = new CharacterHPBar();
    this.endbossHpBar = new EndbossHpBar();
    this.gameStateManager = new GameStateManager(this);
    this.collisionHandler = new CollisionHandler(this);
    this.bottleThrowManager = new BottleThrowManager(this);
    this.screenManager = new ScreenManager(canvas, canvas.getContext("2d"));
    this.renderManager = new RenderManager(
      canvas,
      canvas.getContext("2d"),
      this
    );
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  setLevel(level) {
    this.level = level;
    this.initializeEnemySpawnPoints();
    this.initializeEndboss();
    this.draw();
  }

  initializeEnemySpawnPoints() {
    this.enemySpawnPoints = this.level.enemies.map((enemy) => ({
      type: enemy.constructor.name,
      x: enemy.x,
      spawned: false,
      id: enemy.number,
    }));
  }

  initializeEndboss() {
    let endbossSpawn = this.findEndbossSpawnPoint();
    if (endbossSpawn) {
      this.createEndboss(endbossSpawn);
    }
  }

  findEndbossSpawnPoint() {
    return this.enemySpawnPoints.find((spawn) => spawn.type === "Endboss");
  }

  createEndboss(endbossSpawn) {
    this.endboss = new Endboss(endbossSpawn.id);
    endbossSpawn.spawned = true;
    this.level.enemies = [this.endboss];
  }

  draw() {
    if (this.gamePaused) {
      requestAnimationFrame(() => this.draw());
      return;
    }

    this.allintervals();
    this.renderManager.clearCanvas();

    this.renderManager.renderBackgroundObjects(this.level, this.camera_x);
    this.movableObjects();
    this.drawStatusBars();

    this.drawEndScreen();
    this.gameEndState();

    requestAnimationFrame(() => this.draw());
  }

  allintervals() {
    const currentTime = performance.now();

    if (currentTime - this.lastCheck >= this.checkInterval) {
      this.checkEnemySpawns();
      this.runBasicChecks();
      this.runBottleActions();
      this.runJumpActions();
      this.lastCheck = currentTime;
    }
  }

  runBasicChecks() {
    this.collisionHandler.checkCollisionsWithEnemies();
    this.checkCollectedBottles();
    this.checkCollectedCoins();
    this.checkWinOrLose();
  }

  runBottleActions() {
    this.bottleThrowManager.checkBottleThrow();
    this.bottleThrowManager.checkIfBottleHit();
  }

  runJumpActions() {
    if (this.character.isAboveGround()) {
      this.collisionHandler.handleJumpOnChicken();
      this.collisionHandler.handleJumpOnSmallChicken();
    } else {
      this.collisionHandler.onAnEnemy = false;
    }
  }

  checkEnemySpawns() {
    let spawnDistance = 720;
    this.enemySpawnPoints.forEach((spawn) => {
      this.checkAndSpawnEnemy(spawn, spawnDistance);
    });
  }

  checkAndSpawnEnemy(spawn, spawnDistance) {
    if (this.shouldSpawnEnemy(spawn, spawnDistance)) {
      let enemy = this.createEnemy(spawn);
      this.addEnemyToGame(enemy, spawn);
    }
  }

  shouldSpawnEnemy(spawn, spawnDistance) {
    return (
      !spawn.spawned &&
      spawn.x <= this.character.x + spawnDistance &&
      spawn.type !== "Endboss"
    );
  }

  createEnemy(spawn) {
    switch (spawn.type) {
      case "Chicken":
        return new Chicken(spawn.id);
      case "SmallChicken":
        return new SmallChicken(spawn.id);
      default:
        return null;
    }
  }

  addEnemyToGame(enemy, spawn) {
    if (enemy) {
      this.level.enemies.push(enemy);
      spawn.spawned = true;
    }
  }

  movableObjects() {
    this.renderManager.renderMovableObjects(
      this.level,
      this.character,
      this.camera_x,
      this.bottleThrowManager
    );
  }

  drawStatusBars() {
    if (this.character.x > 5000) {
      this.endbossBarActivated = true;
    }

    this.renderManager.renderStatusBars([
      this.characterHPBar,
      this.coinStatusBar,
      this.bottleStatusbar,
      ...(this.endbossBarActivated ? [this.endbossHpBar] : []),
    ]);
  }

  drawEndScreen() {
    if (this.gameWon || this.gameLost) {
      this.screenManager.drawEndScreen(this.gameWon);
    } 
  }

  gameEndState() {
    if (!this.gameStateHandled && (this.gameWon || this.gameLost)) {
      this.gameStateHandled = true;
      if (this.onGameEnd) {
        this.onGameEnd({
          won: this.gameWon,
          finalTime: document.getElementById("time-container").innerHTML
        });
      }
    }
  }

  pauseGame() {
    this.gameStateManager.pauseGame();
  }

  resumeGame() {
    this.gameStateManager.resumeGame();
  }

  checkCollectedBottles() {
    this.level.collectableBottles.forEach((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.bottleThrowManager.bottleCollected++;
        bottle.bottleCollectSound();
        this.deleteBottle(bottle);
        this.bottleStatusbar.setPercentage(
          this.bottleThrowManager.bottleCollected * 10
        );
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
        this.sounds.playAudio("hp_restored");
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
      this.handleLoseSound();
      this.collisionHandler.damageImmune = true;
    } else if (this.endboss.hp <= 0 && !this.endbossIsDead) {
      this.handleWinSound();
      this.endboss.isAnimated = false;
    }
  }

  handleLoseSound() {
    this.gameLost = true;
    this.characterIsDead = true;
    this.handleGameOver();
    this.sounds.playAudio("character_dead");
    setTimeout(() => {
      this.sounds.playAudio("lose");
    }, 1000);
    
    if (this.onGameEnd) {
      this.onGameEnd({
        won: false,
        finalTime: document.getElementById("time-container").innerHTML
      });
    }
  }

  handleWinSound() {
    this.gameWon = true;
    this.endbossIsDead = true;
    this.handleGameOver();
    this.sounds.playAudio("endboss_dead");
    setTimeout(() => {
      this.sounds.playAudio("win");
    }, 800);
    
    if (this.onGameEnd) {
      this.onGameEnd({
        won: true,
        finalTime: document.getElementById("time-container").innerHTML
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
    this.onGameEnd = callback;
  }
}
