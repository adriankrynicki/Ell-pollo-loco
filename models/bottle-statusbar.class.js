/**
 * Represents the status bar for bottles in the game.
 * Displays the current number of collected bottles as a visual indicator.
 * Extends StatusBar to inherit basic status bar functionality.
 */
class BottleStatusBar extends StatusBar {
  /**
   * Array of image paths for different bottle status bar states.
   * Index corresponds to the fill level (0% to 100%).
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];

  /**
   * Creates a new bottle status bar.
   * Initializes the status bar with default position and empty state.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.setPercentage(0);
    this.x = 10;
    this.y = 32;
  }

  /**
   * Updates the visual state of the bottle status bar.
   * @param {number} percentage - The percentage value to display (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImage()];
    this.img = this.imageCach[path];
  }
}
