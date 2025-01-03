class CollectableBottles extends DrawableObject {
    y = 350;
    height = 90;
    width = 80;

    constructor(imagePath, bottleCount) {
      super().loadImage(imagePath);
  
      this.x = this.getCoordinates(bottleCount);
    }
  
    getCoordinates(bottleCount) {
      let coordinates = [720, 1400, 1700, 2800, 3100, 3600, 3900, 4200, 4500, 5000];
      let index = bottleCount - 1;
      let startPosition;
  
      if (index >= 0 && index < coordinates.length) {
        startPosition = coordinates[index];
      } else {
        startPosition = 700;
      }
  
      return startPosition;
    }

    
  bottleCollectSound() {
    world.sounds.playAudio("bottle_collect");
  }

  getHitbox() {
    return {
      x: this.x + this.width * 0.25,  // 25% vom Rand
      y: this.y + this.height * 0.25,
      width: this.width * 0.5,   // 50% der Originalbreite
      height: this.height * 0.5
    };
  }
  }
  