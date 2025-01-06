class ScreenManager {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.winImage = new Image();
    this.loseImage = new Image();
    this.winImage.src = "img/9_intro_outro_screens/win/won_2.png";
    this.loseImage.src = "img/9_intro_outro_screens/game_over/game over.png";
  }

  drawEndScreen(gameWon) {
    if (gameWon) {
      this.drawWinScreen();
    } else {
      this.drawGameOverScreen();
    }
  }

  drawWinScreen() {
    this.drawOverlay();
    const newWidth = this.winImage.width * 0.5;
    const newHeight = this.winImage.height * 0.5;
    this.drawCenteredImage(this.winImage, newWidth, newHeight);
  }

  drawGameOverScreen() {
    this.drawOverlay();
    const newWidth = this.loseImage.width * 0.5;
    const newHeight = this.loseImage.height * 0.5;
    this.drawCenteredImage(this.loseImage, newWidth, newHeight);
  }

  drawOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCenteredImage(image, width, height) {
    const x = (this.canvas.width - width) / 2;
    const y = (this.canvas.height - height) / 2;
    this.ctx.drawImage(image, x, y, width, height);
  }
}
