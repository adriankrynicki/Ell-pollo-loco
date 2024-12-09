class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  acceleration = 10;
  speed = 80;
  isAttacking = false; 
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor(number) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ATTACK);
    this.applayGravity();

    this.number = number;
    this.x = 2000;
    this.EndbossAnimation();
  }

  EndbossAnimation() {
    setInterval(() => {
      if (this.isDead()) {
        this.deadAnimation();
      } else if (this.isEndbossHurt()) {
        this.hurtAnimation();
      } else if (this.isAttacking) {
        this.attackAnimation();
      } else if (this.hp < 90) {
        this.walkingAnimation();
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }, 200);
  }

  attackAnimation() {
    this.playAnimation(this.IMAGES_ATTACK);
    if (!this.isAboveGround()) {
      this.speedY = -50;
    }
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }

  walkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
    this.OtherDirection = false;
    this.distanceTraveled += this.speed;
    if (this.distanceTraveled >= 100) {
      this.isAttacking = true;
      this.distanceTraveled = 0; 
    }
  }

  hurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  deadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
  }

  endbossHurtSound() {
    world.sounds.playAudio("endboss");
  }
}
