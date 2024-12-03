class BottleStatusBar extends StatusBar {

  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png"
  ];
  
    constructor() {
      super();
      this.loadImages(this.IMAGES_BOTTLE);
      this.setPercentage(0);
      this.x = 10;
      this.y = 32;
    }

    setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES_BOTTLE[this.resolveImage()];
      this.img = this.imageCach[path];
  }
  }
