class RenderManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderBackgroundObjects(level, camera_x) {
        if (!level) return;
        this.ctx.translate(camera_x, 0);
        this.addObjectToMap(level.backgroundObject);
        this.addObjectToMap(level.collectableBottles);
        this.addObjectToMap(level.collectableCoins);
        this.ctx.translate(-camera_x, 0);
    }

    renderMovableObjects(level, character, camera_x, bottleThrowManager) {
        if (!level) return;
        this.ctx.translate(camera_x, 0);

        this.addObjectToMap(level.clouds);
        this.addToMap(character);
        this.drawEnemies(level, character);
        bottleThrowManager.drawBottles();

        this.ctx.translate(-camera_x, 0);
    }

    renderStatusBars(bars) {
        bars.forEach(bar => this.addToMap(bar));
    }

    addObjectToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
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

    drawEnemies(level, character) {
        let visibleEnemies = this.getVisibleEnemies(level.enemies, character);
        this.handleEnemiesVisibility(level.enemies, visibleEnemies);
        this.addObjectToMap(visibleEnemies);
    }

    getVisibleEnemies(enemies, character) {
        let viewportStart = character.x - 200;
        let viewportEnd = character.x + 500;

        return enemies.filter((enemy) => {
            return (
                (enemy.x >= viewportStart && enemy.x <= viewportEnd) ||
                enemy instanceof Endboss
            );
        });
    }

    handleEnemiesVisibility(allEnemies, visibleEnemies) {
        allEnemies.forEach((enemy) => {
            const isVisible = visibleEnemies.includes(enemy);

            if (isVisible && this.shouldStartAnimation(enemy)) {
                enemy.isAnimated = true;
                enemy.startAnimation();
            } else if (!isVisible && this.shouldStopAnimation(enemy)) {
                enemy.isAnimated = false;
                enemy.stopAnimation();
            }
        });
    }

    shouldStartAnimation(enemy) {
        return !enemy.isAnimated && this.isAnimatableEnemy(enemy);
    }

    shouldStopAnimation(enemy) {
        return enemy.isAnimated && this.isAnimatableEnemy(enemy);
    }

    isAnimatableEnemy(enemy) {
        return enemy instanceof Chicken || enemy instanceof SmallChicken;
    }
}
