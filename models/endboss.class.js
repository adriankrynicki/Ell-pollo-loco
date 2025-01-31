class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  speed = 580;
  isAttacking = false;
  isAnimated = false;
  distanceTraveled = 0;
  endbossIsDead = false;
  animation = null;

  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 90,
    left: 40,
    right: 20,
    bottom: 20,
  };
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

  endbossStates = [
    {
      condition: () => this.isDead(),
      execute: (deltaTime) => {
        this.playAnimation(this.IMAGES_DEAD, deltaTime, 10);
        this.speed = 0;
      },
    },
    {
      condition: () => this.isHurt(),
      execute: (deltaTime) => {
        this.playAnimation(this.IMAGES_HURT, deltaTime, 10);
      },
    },
    {
      condition: () => this.isAttacking,
      execute: (deltaTime) => {
        if (!this.isJumping) {
          this.speedY = -100;
          setTimeout(() => {
            this.isJumping = true;
          }, 800);
        }
        this.moveLeft(deltaTime);
        this.playAnimation(this.IMAGES_ATTACK, deltaTime, 10);
        if (!this.isAboveGround() && this.isJumping) {
          this.isAttacking = false;
          this.speedY = 0;
          this.isJumping = false;
        }
      },
      sound: "endboss_attack",
    },
    {
      condition: () => this.hp < 95 && !this.isAttacking,
      execute: (deltaTime) => {
        this.playAnimation(this.IMAGES_WALKING, deltaTime, 10);
        this.moveLeft(deltaTime);
        this.OtherDirection = false;
        this.distanceTraveled += this.speed;
        if (this.distanceTraveled >= 60000) {
          this.isAttacking = true;
          this.distanceTraveled = 0;
        }
      },
      sound: "endboss_walking",
    },
    {
      condition: () => this.isAnimated && this.hp == 100,
      execute: (deltaTime) => {
        this.playAnimation(this.IMAGES_ALERT, deltaTime, 5);
      },
    },
  ];

  constructor(number, services) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.endbossImages();

    this.number = number;
    this.x = 20000;
    this.services = services;
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

  initializeAnimation() {
    if (!this.isAnimated) {
      const animation = {
        update: (deltaTime) => {
          if (!this.services?.world?.gameState?.gamePaused) {
            this.handleEndbossState(deltaTime);
            this.applyGravity(deltaTime);
          }
        },
      };

      this.animation = animation;
      this.services.animationManager.addAnimation(animation);
      this.isAnimated = true;
    }
  }

  handleEndbossState(deltaTime) {
    let activeState = this.endbossStates.find((state) => state.condition());

    this.pauseFlyingSound();
    this.pauseWalkingSound();

    activeState.execute(deltaTime);

    if (activeState.sound) {
      this.services.sounds.playAudio(activeState.sound);
    }
  }

  pauseFlyingSound() {
    if (!this.isAboveGround()) {
      this.services.sounds.pauseAudio("endboss_attack");
    }
  }

  pauseWalkingSound() {
    if (this.isAboveGround() || this.isDead() || this.isHurt()) {
      this.services.sounds.pauseAudio("endboss_walking");
    }
  }
}
