/**
 * Represents the health status bar for the end boss
 * Extends the base StatusBar class to display end boss's health points
 */
class EndbossHpBar extends StatusBar {
  /**
   * Array of image paths for different health states of the end boss
   * @type {string[]}
   */
  IMAGES_HP = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Creates a new EndbossHpBar instance
   * Initializes the health bar with full health and sets its position
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_HP);
    this.setPercentage(100);
    this.setPosition();
  }

  /**
   * Sets the position of the end boss health bar
   * Adjusts position based on window height for responsive design
   */
  setPosition() {
    this.x = 410;
    this.y = 0;

    if (window.innerHeight <= 380) {
      this.x = 390;
    }
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
