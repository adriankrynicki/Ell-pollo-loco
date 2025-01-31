class RenderManager {
  // Class Fields
  canvas;
  ctx;
  world;
  endbossActivated = false;
  lastFrameTime = 0;
  frameInterval = 1000 / 60; // Zielwert für 60 FPS
  animationManager;
  level;
  drawer;

  constructor(services) {
    // Nur Basis-Services im Constructor
    this.canvas = services.canvas;
    this.ctx = services.ctx;
    this.world = services.world;
    this.animationManager = services.animationManager;
    this.services = services;

    // Referenzobjekt für Zeichenmethoden
    this.drawer = new MovableObject(); // oder new DrawableObject()
    this.drawer.ctx = this.ctx; // ctx setzen
  }

  initialize(level) {
    this.services.world.level = level;

    // Animation erst nach Level-Initialisierung hinzufügen
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (
          this.services.world.level &&
          !this.services.world.gameState.gamePaused
        ) {
          this.render();
        }
      },
    });
  }

  render() {
    if (!this.services.world.level) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.world.camera_x, 0);
    this.drawBackground();
    this.drawClouds();
    this.drawCollectableObjects();
    this.drawEnemies();
    this.drawThrowableBottles();
    this.drawCharacter();
    this.ctx.translate(-this.world.camera_x, 0);
    this.drawStatusBars();
    this.services.screenManager.drawEndScreen();
  }

  drawBackground() {
    if (this.services.world.level?.backgroundObjects) {
      this.drawer.addObjectToMap(this.services.world.level.backgroundObjects);
    }
  }

  drawClouds() {
    if (!this.services.world?.level) return;

    // Initialisiere nicht-animierte Clouds
    this.services.world.level.clouds.forEach((cloud) => {
      if (!cloud.isAnimated) {
        cloud.initialize();
      }
    });

    // Zeichne alle Clouds mit der vorhandenen Methode
    this.drawer.addObjectToMap(this.services.world.level.clouds);
  }

  drawThrowableBottles() {
    if (!this.services?.bottleThrowManager?.throwableBottles) return;

    for (const [id, bottle] of this.services.bottleThrowManager
      .throwableBottles) {
      this.drawer.addToMap(bottle);
    }
  }

  drawCharacter() {
    if (this.services?.character) {
      this.drawer.addToMap(this.services.character);
    }
  }

  drawCollectableObjects() {
    if (
      this.services.world.level?.collectableCoins &&
      this.services.world.level?.collectableBottles
    ) {
      const collectables = [
        ...this.services.world.level.collectableCoins,
        ...this.services.world.level.collectableBottles,
      ];

      this.drawer.addObjectToMap(collectables);
    }
  }

  drawStatusBars() {
    const { character, statusBars, endbossHpBar } = this.services;

    if (!statusBars) return;

    if (character?.x > 19300) {
      character.isInBossArea = true;
    }

    if (character.isInBossArea && endbossHpBar) {
      endbossHpBar.draw(this.ctx);
    }

    statusBars?.character?.draw(this.ctx);
    statusBars?.bottle?.draw(this.ctx);
    statusBars?.coin?.draw(this.ctx);
  }

  drawEnemies() {
    if (!this.services.world.level?.enemies || !this.services?.character)
      return;

    this.services.world.level.enemies.filter((enemy) => {
      if (!enemy) return;
      let endboss = enemy instanceof Endboss;
      let characterX = this.services.character.x;
      let distance = enemy.x - characterX;

      if (!enemy.isAnimated && !enemy.isKilld && Math.abs(distance) < 720) {
        enemy.initializeAnimation();
      } else if (!endboss && enemy.isKilld) {
        this.animationManager.removeAnimation(enemy.animation);
        this.removeFromMap(enemy);
      } else if (!endboss && enemy.x <= -300) {
        this.animationManager.removeAnimation(enemy.animation);
        this.removeFromMap(enemy);
      }
      if (!enemy.isKilld) {
        this.drawer.addToMap(enemy);
      }
    });
  }

  removeFromMap(enemy) {
    const index = this.services.world.level.enemies.indexOf(enemy);
    if (index !== -1) {
      this.services.world.level.enemies.splice(index, 1);
    }
  }
}
