class RenderManager {
  constructor(canvas, ctx, world) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.world = world;
    this.endbossActivated = false;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 60;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderWithTranslation(callback, camera_x) {
    this.ctx.translate(camera_x, 0);
    callback();
    this.ctx.translate(-camera_x, 0);
  }

  renderBackground(level, camera_x) {
    if (!level) return;
    this.renderWithTranslation(() => {
      const objectGroups = [
        { items: level.backgroundObject, name: "background" },
        { items: level.clouds, name: "clouds" },
      ];
      this.renderObjects(objectGroups, camera_x);
    }, camera_x);
  }

  renderGameObjects(level, character, camera_x, bottleThrowManager) {
    if (!level) return;
    
    this.renderWithTranslation(() => {
        this.renderCollectableObjects(level, camera_x);
        this.renderMovableObjects(character, level, bottleThrowManager);
    }, camera_x);
  }

  renderCollectableObjects(level, camera_x) {
    const viewport = this.getViewport(camera_x);
    const objectGroups = [
      { 
        items: level.collectableCoins,
        name: "coins",
        batchSize: 10
      },
      { 
        items: level.collectableBottles,
        name: "bottles",
        batchSize: 5
      }
    ];
    
    objectGroups.forEach(({ items, name, batchSize }) => {
      const visibleItems = this.filterVisibleObjects(items, viewport);
      this.batchRenderObjects(visibleItems, batchSize);
    });
  }

  batchRenderObjects(objects, batchSize) {
    for (let i = 0; i < objects.length; i += batchSize) {
      const batch = objects.slice(i, i + batchSize);
      this.ctx.save();
      batch.forEach(obj => this.addToMap(obj));
      this.ctx.restore();
    }
  }

  renderMovableObjects(character, level, bottleThrowManager) {
    this.addToMap(character);
    this.drawEnemies(level, character);
    bottleThrowManager.drawBottles();
  }

  renderObjects(objectGroups, camera_x) {
    const viewport = this.getViewport(camera_x);
    objectGroups.forEach(({ items, name }) => {
      const visibleItems = this.filterVisibleObjects(items, viewport);
      this.addObjectToMap(visibleItems);
    });
  }

  getViewport(camera_x) {
    return {
      start: -camera_x - 719,
      end: -camera_x + this.canvas.width + 719,
    };
  }

  renderStatusBars(bars) {
    bars.forEach((bar) => this.addToMap(bar));
  }

  filterVisibleObjects(objects, viewport) {
    return objects.filter(
      (obj) => obj.x >= viewport.start && obj.x <= viewport.end
    );
  }

  addObjectToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
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

  drawEnemies(level, character) {
    const viewportStart = character.x - 200;
    const viewportEnd = character.x + 720;
    
    this.handleEnemiesVisibility(
        level.enemies,
        character,
        viewportStart,
        viewportEnd
    );
    
    const activeEnemies = level.enemies.filter(enemy => 
        enemy.isAnimated && 
        enemy.x >= viewportStart && 
        enemy.x <= viewportEnd
    );

    this.batchRenderObjects(activeEnemies, 3);
  }

  handleEnemiesVisibility(enemies, character, viewportStart, viewportEnd) {
    enemies.forEach((enemy) => {
      this.updateEnemyVisibility(enemy, character, viewportStart, viewportEnd);
      this.updateEnemyAnimation(enemy);
    });
  }

  updateEnemyVisibility(enemy, character, viewportStart, viewportEnd) {
    if (enemy instanceof Endboss) {
      if (character.x >= 4800) {
        this.endbossActivated = true;
      }
      enemy.isAnimated = this.endbossActivated;
    } else {
      enemy.isAnimated =
        this.world.gameLost ||
        (enemy.x >= viewportStart && enemy.x <= viewportEnd);
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
    return (
      enemy.isAnimated && !enemy.isCurrentlyAnimated && !this.world.gameLost
    );
  }

  shouldStopAnimation(enemy) {
    return (
      (!enemy.isAnimated || this.world.gameLost) && enemy.isCurrentlyAnimated
    );
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
}
