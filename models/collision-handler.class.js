class CollisionHandler {
  constructor(world) {
    this.world = world;
    this.onAnEnemy = false;
    this.damageImmune = false;
    this.damageImmuneTimer = 0;
  }

  get character() {
    return this.world.character;
  }

  get endboss() {
    return this.world.level.enemies.find(
      (e) => e.constructor.name === "Endboss"
    );
  }

  get chicken() {
    return this.world.level.enemies.filter(
      (e) => e.constructor.name === "Chicken"
    );
  }

  get smallChicken() {
    return this.world.level.enemies.filter(
      (e) => e.constructor.name === "SmallChicken"
    );
  }

  get characterHPBar() {
    return this.world.characterHPBar;
  }

  get endbossHpBar() {
    return this.world.endbossHpBar;
  }

  checkCharacterAfterJumpOnAnEnemy() {
    if (!this.character.isAboveGround()) {
      this.onAnEnemy = false;
    }
  }

  checkCollisionsWithEnemies() {
    if (this.endboss) {
      this.handleCollisionsWithEndboss(this.endboss);
    }

    this.chicken.forEach((chicken) => {
      this.handleCollisionsWithChicken(chicken);
    });

    this.smallChicken.forEach((smallChicken) => {
      this.handleCollisionsWithSmallChicken(smallChicken);
    });
  }

  checkCollisionFromAbove() {
    const collidingChicken = this.chicken.find(
      (chicken) =>
        this.character.isColliding(chicken) &&
        this.character.isAboveGround() &&
        this.character.speedY > 0
    );

    if (collidingChicken) {
      this.handleChickenCollision(collidingChicken);
    }

    const collidingSmallChicken = this.smallChicken.find(
      (smallChicken) =>
        this.character.isColliding(smallChicken) &&
        this.character.isAboveGround() &&
        this.character.speedY > 0
    );

    if (collidingSmallChicken) {
      this.handleSmallChickenCollision(collidingSmallChicken);
    }
  }

  handleCollisionsWithEndboss(endboss) {
    if (
      this.character.isColliding(endboss) &&
      !this.character.isAboveGround() &&
      !this.damageImmune
    ) {
      this.handleEndbossCollisionOnGround(endboss);
    } else if (
      this.character.isCollidingWithEndbossAboveGround(endboss) &&
      this.character.isAboveGround() &&
      !this.damageImmune
    ) {
      this.handleEndbossCollisionAboveGround();
    }
  }

  handleCollisionsWithChicken(chicken) {
    if (
      this.character.isColliding(chicken) &&
      !this.character.isAboveGround() &&
      !this.damageImmune
    ) {
      this.characterBehaviorAfterCollisionWithEnemy();
    }
  }

  handleCollisionsWithSmallChicken(smallChicken) {
    if (
      this.character.isColliding(smallChicken) &&
      !this.character.isAboveGround() &&
      !this.damageImmune
    ) {
      this.characterBehaviorAfterCollisionWithEnemy();
    }
  }

  handleEndbossCollisionOnGround(endboss) {
    if (this.character.isCollidingWithEndbossOnGround(endboss)) {
      this.world.canMoveRight = false;
      this.character.hit();
      this.character.Endbosskick();
      setTimeout(() => {
        this.world.canMoveRight = true;
      }, 1000);
    }
  }

  handleEndbossCollisionAboveGround() {
    this.world.canMoveRight = false;
    this.character.Endbosskick();
    setTimeout(() => {
      this.world.canMoveRight = true;
    }, 1000);
    this.character.hit();
    this.characterHPBar.setPercentage(this.character.hp);
    this.character.characterHurtSound();
  }

  handleChickenCollision(chicken) {
    if (!this.onAnEnemy) {
      this.onAnEnemy = true;
      chicken.hit();
      chicken.deadChickenSound();
      this.character.speedY = -20;
      this.character.jumpSound();
      this.deleteChicken(chicken);
    }
  }

  handleSmallChickenCollision(smallChicken) {
    if (!this.onAnEnemy) {
      this.onAnEnemy = true;
      smallChicken.hit();
      smallChicken.deadSmallChickenSound();
      this.character.speedY = -20;
      this.character.jumpSound();
      this.deleteChicken(smallChicken);
    }
  }

  characterBehaviorAfterCollisionWithEnemy() {
    this.damageImmune = true;
    this.world.canMoveRight = false;
    this.character.enemyKick();
    this.character.hit();
    this.characterHPBar.setPercentage(this.character.hp);
    this.character.characterHurtSound();

    setTimeout(() => {
      this.world.canMoveRight = true;
      this.damageImmune = false;
    }, 1000);
  }

  async deleteChicken(enemy) {
    await enemy.playDeathAnimation();

    if (enemy.constructor.name === "Chicken") {
      this.world.level.enemies = this.world.level.enemies.filter(
        (e) => e !== enemy
      );
    } else if (enemy.constructor.name === "SmallChicken") {
      this.world.level.enemies = this.world.level.enemies.filter(
        (e) => e !== enemy
      );
    }
    this.world.draw();
  }
}
