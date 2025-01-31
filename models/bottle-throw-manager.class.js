class BottleThrowManager {
  bottleThrowAvailable = false;

  constructor(services) {
    this.services = services;
    this.throwableBottles = new Map();
  }

  canThrowBottle() {
    return this.bottleThrowAvailable && this.throwableBottles.size < 1;
  }

  manageBottleThrow() {
    if (this.canThrowBottle()) {
      this.handleBottleThrow();
    }
  }

  handleBottleThrow() {
    let bottle = new ThrowableBottles(
      this.services.character.x + 30,
      this.services.character.y + 100,
      this.services
    );
    this.throwableBottles.set(bottle.id, bottle);
    this.services.sounds.playAudio("bottle_throw");

    this.services.collectablesObjects.collectedBottles--;
    this.services.world.statusBars.bottle.setPercentage(
      this.services.collectablesObjects.collectedBottles * 10
    );

    if (this.services.collectablesObjects.collectedBottles === 0) {
      this.bottleThrowAvailable = false;
    }
    setTimeout(() => {
      this.services.character.throwActive = false;
    }, 200);
  }
}
