class EndbossHpBar extends StatusBar {
  IMAGES_HP = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_HP);
    this.setPercentage(100);
    this.setPosition();
  }

  setPosition() {
    this.x = 410;
    this.y = 0;

    if (window.innerHeight <= 380) {
      this.x = 390;
    }
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_HP[this.resolveImage()];
    this.img = this.imageCach[path];
  }
}
