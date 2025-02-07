/**
 * Represents the status bar for collected coins in the game.
 * Displays the current number of collected coins as a visual indicator.
 */
class CoinStatusBar extends StatusBar {
  /**
   * Array of image paths for different coin status bar states.
   * Index corresponds to the fill level (0% to 100% in 20% steps).
   * @type {string[]}
   */
  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  /**
   * Constructor for CoinStatusBar class
   * Initializes the status bar with default values.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.setPercentage(0);
    this.x = 10;
    this.y = 70;
  }

  /**
   * Updates the visual state of the coin status bar.
   * @param {number} percentage - The percentage value to display (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImage()];
    this.img = this.imageCach[path];
  }
}
