class RenderManager {
  constructor(canvas, ctx, world) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.world = world;
    this.endbossActivated = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderBackgroundObjects(level, camera_x) {
    if (!level) return;
    this.ctx.translate(camera_x, 0);
    
    this.drawBackgroundObjects(level, camera_x);
    this.addObjectToMap(level.collectableBottles);
    this.addObjectToMap(level.collectableCoins);
    
    this.ctx.translate(-camera_x, 0);
  }

  renderMovableObjects(level, character, camera_x, bottleThrowManager) {
    if (!level) return;
    this.ctx.translate(camera_x, 0);

    this.drawClouds(level, camera_x);
    this.addToMap(character);
    this.drawEnemies(level, character);
    bottleThrowManager.drawBottles();

    this.ctx.translate(-camera_x, 0);
  }

  renderStatusBars(bars) {
    bars.forEach((bar) => this.addToMap(bar));
  }

  addObjectToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
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

  drawBackgroundObjects(level, camera_x) {
    let viewportStart = -camera_x - 719;
    let viewportEnd = -camera_x + this.canvas.width + 719;

    const visibleBackgrounds = level.backgroundObject.filter(bg => 
        bg.x >= viewportStart && bg.x <= viewportEnd
    );
    
    this.addObjectToMap(visibleBackgrounds);
  }

  drawEnemies(level, character) {
    let viewportStart = character.x - 1000;
    let viewportEnd = character.x + 720;
    this.handleEnemiesVisibility(level.enemies, character, viewportStart, viewportEnd);
    this.addObjectToMap(level.enemies.filter(enemy => enemy.isAnimated));
  }

  handleEnemiesVisibility(enemies, character, viewportStart, viewportEnd) {
    enemies.forEach((enemy) => {
      this.updateEnemyVisibility(enemy, character, viewportStart, viewportEnd);
      this.updateEnemyAnimation(enemy);
    });
  }

  updateEnemyVisibility(enemy, character, viewportStart, viewportEnd) {
    if (enemy instanceof Endboss) {
      if (character.x >= 1500) {
        this.endbossActivated = true;
      }
      enemy.isAnimated = this.endbossActivated;
    } else {
      enemy.isAnimated = this.world.gameLost || (enemy.x >= viewportStart && enemy.x <= viewportEnd);
    }
  }

  updateEnemyAnimation(enemy) {
    if (this.shouldStartAnimation(enemy)) {
      this.startEnemyAnimation(enemy);
    } else if (this.shouldStopAnimation(enemy)) {
      this.stopEnemyAnimation(enemy);
    } else if (this.shouldHandleGameWon(enemy)) {
      this.handleGameWonAnimation(enemy);
    }
  }

  shouldStartAnimation(enemy) {
    return enemy.isAnimated && !enemy.isCurrentlyAnimated && !this.world.gameLost;
  }

  shouldStopAnimation(enemy) {
    return (!enemy.isAnimated || this.world.gameLost) && enemy.isCurrentlyAnimated;
  }

  shouldHandleGameWon(enemy) {
    return this.world.gameWon && enemy.isCurrentlyAnimated;
  }

  startEnemyAnimation(enemy) {
    enemy.startAnimation();
    enemy.isCurrentlyAnimated = true;
  }

  stopEnemyAnimation(enemy) {
    enemy.stopAnimation();
    enemy.isCurrentlyAnimated = false;
  }

  handleGameWonAnimation(enemy) {
    if (enemy instanceof Endboss) {
      setTimeout(() => {
        this.stopEnemyAnimation(enemy);
      }, 1000);
    } else {
      this.stopEnemyAnimation(enemy);
    }
  }

  drawClouds(level, camera_x) {
    let viewportStart = -camera_x - 719;
    let viewportEnd = -camera_x + this.canvas.width + 719;

    const visibleClouds = level.clouds.filter(cloud => 
        cloud.x >= viewportStart && cloud.x <= viewportEnd
    );
    
    this.addObjectToMap(visibleClouds);
  }
}
