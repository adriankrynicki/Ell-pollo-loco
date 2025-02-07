/**
 * Represents the health status bar for the character
 * Extends the base StatusBar class to display character's health points
 */
class CharacterHPBar extends StatusBar {
  /**
   * Array of image paths for different health states
   * @type {string[]}
   */
  IMAGES_HP = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Creates a new CharacterHPBar instance
   * Initializes the health bar with full health and sets its position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HP);
    this.setPercentage(100);
    this.x = 10;
    this.y = -5;
  }

  /**
   * Sets the health percentage and updates the health bar image
   * @param {number} percentage - The health percentage (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_HP[this.resolveImage()];
    this.img = this.imageCach[path];
  }
}
