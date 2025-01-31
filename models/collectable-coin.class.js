class CollectableCoin extends MovableObject {
  width = 100;
  height = 100;
  isCollected = false;
  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 35,
    left: 35,
    right: 35,
    bottom: 35,
  };

  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
