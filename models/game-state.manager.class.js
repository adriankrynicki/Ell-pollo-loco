class GameStateManager {
    constructor(world) {
        this.world = world;
        this.pausedPositions = {};
    }

    pauseGame() {
        this.world.gamePaused = true;
        this.saveCurrentPositions();
        this.world.sounds.pauseAudio('background_music');
        this.world.sounds.pauseAudio('snoring');
    }

    resumeGame() {
        this.restorePositions();
        this.world.gamePaused = false;
        this.world.sounds.playAudio('background_music');
        if (this.world.character.isSleeping) {
            this.world.sounds.playAudio('snoring');
        }
    }

    saveCurrentPositions() {
        this.saveCharacterPosition();
        this.saveEnemyPositions();
        this.saveBottlePositions();
    }

    saveCharacterPosition() {
        this.pausedPositions.character = {
            x: this.world.character.x,
            y: this.world.character.y,
            speedX: this.world.character.speedX,
            speedY: this.world.character.speedY
        };
    }

    saveEnemyPositions() {
        this.pausedPositions.enemies = this.world.level.enemies.map(enemy => ({
            number: enemy.number,
            type: enemy.constructor.name,
            x: enemy.x,
            y: enemy.y,
            speedX: enemy.speedX,
            speedY: enemy.speedY
        }));  
    }

    saveBottlePositions() {
        this.pausedPositions.bottles = Array.from(this.world.bottleManager.throwableBottles.values()).map(bottle => ({
            x: bottle.x,
            y: bottle.y,
            speedX: bottle.speedX,
            speedY: bottle.speedY
        }));
    }

    restorePositions() {
        this.restoreCharacterPosition();
        this.restoreEnemyPositions();
        this.restoreBottlePositions();
    }

    restoreCharacterPosition() {
        if (this.pausedPositions.character) {
            this.world.character.x = this.pausedPositions.character.x;
            this.world.character.y = this.pausedPositions.character.y;
            this.world.character.speedX = this.pausedPositions.character.speedX;
            this.world.character.speedY = this.pausedPositions.character.speedY;
        }
    }

    restoreEnemyPositions() {
        this.pausedPositions.enemies?.forEach(pos => {
            const enemy = this.world.level.enemies.find(e => 
                e.number === pos.number && 
                e.constructor.name === pos.type
            );
            if (enemy) this.restoreEnemyPosition(enemy, pos);
        });
    }

    restoreEnemyPosition(enemy, pos) {
        if (!enemy) return;
        
        enemy.x = pos.x;
        enemy.y = pos.y;
        enemy.speedX = pos.speedX;
        enemy.speedY = pos.speedY;
    }

    restoreBottlePositions() {
        this.pausedPositions.bottles?.forEach((pos, index) => {
            const bottles = Array.from(this.world.bottleManager.throwableBottles.values());
            if (bottles[index]) {
                bottles[index].x = pos.x;
                bottles[index].y = pos.y;
                bottles[index].speedX = pos.speedX;
                bottles[index].speedY = pos.speedY;
            }
        });
    }
}
