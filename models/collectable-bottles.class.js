class CollectableBottles extends DrawableObject {
    y = 350;
    height = 90;
    width = 80;

    constructor(imagePath, bottleCount) {
      super().loadImage(imagePath);
  
      this.x = this.getRandomCoordinates(bottleCount);
    }
  
    getRandomCoordinates(bottleCount) {
      let coordinates = [300, 300, 300, 500, 800, 1000, 1300, 1600, 1900, 2300, 2500, 2800];
      let index = bottleCount - 1;
      let startPosition;
  
      if (index >= 0 && index < coordinates.length) {
        startPosition = coordinates[index];
      } else {
        startPosition = 300;
      }
  
      return startPosition + Math.random() * 500;
    }

    
  bottleCollectSound() {
    world.sounds.playAudio("bottle_collect");
  }
  }
  