class BottleThrowManager {
    constructor(world) {
        this.world = world;
        this.throwableBottles = new Map();
        this.bottleCollected = 0;
        this.keyDPressed = false;
    }

    // Getter für einfacheren Zugriff
    get character() {
        return this.world.character;
    }

    get keyboard() {
        return this.world.keyboard;
    }

    get sounds() {
        return this.world.sounds;
    }

    get level() {
        return this.world.level;
    }

    get bottleStatusbar() {
        return this.world.bottleStatusbar;
    }

    drawBottles() {
        this.throwableBottles.forEach(bottle => {
            this.world.addToMap(bottle);
        });
    }

    checkBottleThrow() {
        if (this.bottleThrowCondition()) {
            this.handleBottleThrow();
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

    handleBottleThrow() {
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
    }

    checkIfBottleHit() {
        for (const [bottleId, bottle] of this.throwableBottles.entries()) {
            this.checkBottleCollisionWithEnemies(bottle, bottleId);
            this.checkBottleCollisionWithGround(bottle, bottleId);
        }
    }

    checkBottleCollisionWithEnemies(bottle, bottleId) {
        for (let enemyIndex = this.level.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
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
        } else if (enemy instanceof Endboss && this.world.endboss.hp > 10) {
            this.world.endboss.endbossHurtSound();
        }
    }

    applyDamageToEnemy(enemy) {
        enemy.bottledamage();
    }

    removeBottle(bottleId) {
        this.throwableBottles.delete(bottleId);
    }

    handleEnemyAfterCollision(enemy) {
        if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
            this.deleteChicken(enemy);
        } else if (enemy instanceof Endboss) {
            this.world.endbossHpBar.setPercentage(enemy.hp);
        }
    }

    deleteChicken(enemy) {
        setTimeout(() => {
            let index = this.level.enemies.indexOf(enemy);
            if (index > -1) {
                this.level.enemies.splice(index, 1);
                this.world.draw();
            }
        }, 350);
    }
}
