class CollectableBottles extends MovableObject {
  y = 350;
  height = 90;
  width = 80;
  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 20,
    left: 30,
    right: 30,
    bottom: 20,
  };

  constructor(imagePath, bottleCount) {
    super().loadImage(imagePath);

    this.x = this.getCoordinates(bottleCount);
  }

  getCoordinates(bottleCount) {
    let coordinates = [
      720, 1400, 1700, 2800, 3100, 3600, 3900, 4200, 4500, 5000, 5300, 5600,
      5900, 6200, 6500, 6800, 7100, 7400, 7700, 8000, 8720, 9400, 10000, 11000,
      12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000,
    ];
    let index = bottleCount - 1;
    let startPosition;

    if (index >= 0 && index < coordinates.length) {
      startPosition = coordinates[index];
    } else {
      startPosition = 700;
    }

    return startPosition;
  }
}
