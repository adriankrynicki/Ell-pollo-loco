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

  lastStateUpdate = 0;
  animationInterval = 1000; // Zeit in Millisekunden zwischen den Frames
  animationFrameId = null;

  animations = [
    {
      condition: () => this.isDead(),
      state: 'dead',
      images: this.IMAGES_DEAD,
      interval: 200,
      action: () => {} // Keine Aktion wenn tot
    },
    {
      condition: () => this.isEndbossHurt(),
      state: 'hurt',
      images: this.IMAGES_HURT,
      interval: 150,
      action: () => {} // Keine Aktion wenn verletzt
    },
    {
      condition: () => this.isAttacking,
      state: 'attack',
      images: this.IMAGES_ATTACK,
      interval: 200,
      action: () => {
        if (!this.isAboveGround()) {
          this.speedY = -40;
        }
        setTimeout(() => {
          this.isAttacking = false;
        }, 1000);
      }
    },
    {
      condition: () => this.hp < 90,
      state: 'walking',
      images: this.IMAGES_WALKING,
      interval: 200,
      action: () => {
        this.moveLeft();
        this.OtherDirection = false;
        this.distanceTraveled += this.speed;
        if (this.distanceTraveled >= 100) {
          this.isAttacking = true;
          this.distanceTraveled = 0;
        }
      }
    },
    {
      condition: () => true,
      state: 'alert',
      images: this.IMAGES_ALERT,
      interval: 200,
      action: () => {} // Keine Aktion im Alert-Zustand
    }
  ];

  constructor(number, isAnimated) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.endbossImages();
    this.applayGravity();
    this.isAnimated = isAnimated;
    this.animationInterval = null;

    this.number = number;
    this.x = 5500;
  }

  endbossImages() {
    let endbossImages = [
      this.IMAGES_ALERT,
      this.IMAGES_WALKING,
      this.IMAGES_ATTACK,
      this.IMAGES_HURT,
      this.IMAGES_DEAD,
    ];
    endbossImages.forEach((images) => {
      this.loadImages(images);
    });
  }

  handleAnimationStates() {
    const currentTime = performance.now();
    const animation = this.animations.find(a => a.condition());

    if (!this.lastStateUpdate || 
      currentTime - this.lastStateUpdate >= animation.interval) {
      this.playAnimation(animation.images);
      animation.action(); // Führe die zugehörige Aktion aus
      this.lastStateUpdate = currentTime;
    }
  }

  startAnimation() {
    this.stopAnimation();

    const animate = () => {
      this.handleAnimationStates();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  endbossHurtSound() {
    world.sounds.playAudio("endboss");
  }

  getHitbox() {
    return {
      x: this.x + this.width * 0.15,  // 15% vom Rand
      y: this.y + this.height * 0.1,
      width: this.width * 0.7,   // 70% der Originalbreite
      height: this.height * 0.8
    };
  }
}
