class CoinStatusBar extends StatusBar {

  IMAGES_COINS = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
  ];

    constructor() {
      super();
      this.loadImages(this.IMAGES_COINS);
      this.setPercentage(0);
      this.x = 10;
      this.y = 70;
    }

    setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES_COINS[this.resolveImage()];
      this.img = this.imageCach[path];
  }
  }