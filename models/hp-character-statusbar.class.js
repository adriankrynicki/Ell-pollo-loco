class CharacterHPBar extends StatusBar {

  IMAGES_HP = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];
  
    constructor() {
      super();
      this.loadImages(this.IMAGES_HP);
      this.setPercentage(100);
      this.x = 10;
      this.y = -5;
    }

    setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES_HP[this.resolveImage()];
      this.img = this.imageCach[path];
  }
  }