/**
 * Manages end-game screens.
 * Handles the rendering of win and lose screens with appropriate images and overlays.
 */
class ScreenManager {
  /**
   * @param {Object} services - Service dependencies for screen management
   * @param {HTMLCanvasElement} services.canvas - The game's canvas element
   * @param {CanvasRenderingContext2D} services.ctx - The canvas rendering context
   * @param {World} services.world - Reference to the game world for state checking
   */
  constructor(services) {
    this.services = services;
    this.canvas = services.canvas;
    this.ctx = services.ctx;
    this.winImage = new Image();
    this.loseImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/win/won_2.png";
    this.loseImage.src = "img/9_intro_outro_screens/game_over/game over.png";
  }

  /**
   * Manages the display of end-game screens based on the current game state.
   * Determines whether to show the win or lose screen.
   */
  drawEndScreen() {
    if (this.canDrawEndScreen()) return;

    if (this.services.world?.gameState?.gameWon) {
      this.drawWinScreen();
    } else if (this.services.world?.gameState?.gameLost) {
      this.drawGameOverScreen();
    }
  }

  /**
   * Checks if conditions are met to display an end screen.
   * @returns {boolean} True if no end screen should be shown, false otherwise
   */
  canDrawEndScreen() {
    return (
      !this.services.world.gameState.gameWon &&
      !this.services.world.gameState.gameLost
    );
  }

  /**
   * Renders the victory screen.
   */
  drawWinScreen() {
    this.drawOverlay();
    const newWidth = this.winImage.width * 0.5;
    const newHeight = this.winImage.height * 0.5;
    this.drawCenteredImage(this.winImage, newWidth, newHeight);
  }

  /**
   * Renders the game over screen.
   */
  drawGameOverScreen() {
    this.drawOverlay();
    const newWidth = this.loseImage.width * 0.5;
    const newHeight = this.loseImage.height * 0.5;
    this.drawCenteredImage(this.loseImage, newWidth, newHeight);
  }

  /**
   * Draws a semi-transparent overlay on the canvas.
   */
  drawOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws an image centered on the canvas.
   * @param {HTMLImageElement} image - The image to draw
   * @param {number} width - The desired width of the image
   * @param {number} height - The desired height of the image
   */
  drawCenteredImage(image, width, height) {
    const x = (this.canvas.width - width) / 2;
    const y = (this.canvas.height - height) / 2;
    this.ctx.drawImage(image, x, y, width, height);
  }
}
