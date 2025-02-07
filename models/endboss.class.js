/**
 * Represents the final boss enemy in the game.
 * @class
 */
class Endboss extends MovableObject {
      /**
     * Height of the endboss in pixels
     * @type {number}
     */
  height = 400;
  /**
   * Width of the endboss in pixels
   * @type {number}
   */
  width = 250;
  /**
   * Y position of the endboss in pixels
   * @type {number}
   */
  y = 60;
  /**
   * Speed of the endboss in pixels per second
   * @type {number}
   */
  speed = 580;
  /**
   * Indicates if the endboss is attacking
   * @type {boolean}
   */
  isAttacking = false;
  /**
   * Indicates if the endboss is animated
   * @type {boolean}
   */
  isAnimated = false;
  /**
   * Distance traveled by the endboss
   * @type {number}
   */
  distanceTraveled = 0;
  /**
   * Indicates if the endboss is dead
   * @type {boolean}
   */
  endbossIsDead = false;
  /**
   * Animation object for the endboss
   * @type {Object}
   */
  animation = null;
  /**
   * Collision offset for precise hitbox detection
   * @type {Object}
   */
  offset = {
    top: 90,
    left: 40,
    right: 20,
    bottom: 20,
  };
  /**
   * Images for the endboss walking animation
   * @type {Array<string>}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  /**
   * Images for the endboss alert animation
   * @type {Array<string>}
   */
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
  /**
   * Images for the endboss attack animation
   * @type {Array<string>}
   */
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
  /**
   * Images for the endboss hurt animation
   * @type {Array<string>}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  /**
   * Images for the endboss dead animation
   * @type {Array<string>}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * States of the endboss
   * @type {Array<Object>}
   */
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
        this.handleJumpAttack(deltaTime);
      },
      sound: "endboss_attack",
    },
    {
      condition: () => this.hp < 95 && !this.isAttacking,
      execute: (deltaTime) => {
        this.initializeAttack(deltaTime);
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

  /**
   * Constructor for the Endboss class
   * @param {number} number - The number of the endboss
   * @param {Object} services - The services object
   */
  constructor(number, services) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.endbossImages();

    this.number = number;
    this.x = 20000;
    this.services = services;
  }

  /**
   * Loads the endboss images
   */
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

  /**
   * Initializes the endboss animation
   */
  initializeAnimation() {
    if (this.isAnimated) return;

    let animation = this.createAnimationObject();
    this.addAnimationToManager(animation);
  }

  /**
   * Creates an animation object for the endboss
   * @returns {Object} - Animation object with update method
   */
  createAnimationObject() {
    return {
      update: (deltaTime) => {
        if (!this.services?.world?.gameState?.gamePaused) {
          this.handleEndbossState(deltaTime);
          this.applyGravity(deltaTime);
          this.checkAttackEnd();
        }
      },
    };
  }

  /**
   * Adds the animation to the animation manager
   * @param {Object} animation - The animation object to add
   */
  addAnimationToManager(animation) {
    this.services.animationManager.addAnimation(animation);
    this.isAnimated = true;
  }

  /**
   * Handles the endboss state based on the current conditions
   * @param {number} deltaTime - The time elapsed since the last frame
   */
  handleEndbossState(deltaTime) {
    let activeState = this.endbossStates.find((state) => state.condition());

    this.pauseFlyingSound();
    this.pauseWalkingSound();

    activeState.execute(deltaTime);

    if (activeState.sound) {
      this.services.sounds.playAudio(activeState.sound);
    }
  }

  /**
   * Handles the endboss jump attack
   * @param {number} deltaTime - The time elapsed since the last frame
   */
  handleJumpAttack(deltaTime) {
    if (!this.isJumping) {
      this.speedY = -100;
      setTimeout(() => {
        this.isJumping = true;
      }, 800);
    }
    this.moveLeft(deltaTime);
    this.playAnimation(this.IMAGES_ATTACK, deltaTime, 10);
  }

  /**
   * Checks if the endboss attack has ended
   */
  checkAttackEnd() {
    if (!this.isAboveGround() && this.isJumping) {
      this.isAttacking = false;
      this.speedY = 0;
      this.isJumping = false;
    }
  }

  /**
   * Initializes the endboss attack
   * @param {number} deltaTime - The time elapsed since the last frame
   */
  initializeAttack(deltaTime) {
    this.playAnimation(this.IMAGES_WALKING, deltaTime, 10);
    this.moveLeft(deltaTime);
    this.OtherDirection = false;
    this.distanceTraveled += this.speed;
    if (this.distanceTraveled >= 60000) {
      this.isAttacking = true;
      this.distanceTraveled = 0;
    }
  }

  /**
   * Pauses the flying sound if the endboss is not above ground
   */
  pauseFlyingSound() {
    if (!this.isAboveGround()) {
      this.services.sounds.pauseAudio("endboss_attack");
    }
  }

  /**
   * Pauses the walking sound if the endboss is above ground or dead or hurt
   */
  pauseWalkingSound() {
    if (this.isAboveGround() || this.isDead() || this.isHurt()) {
      this.services.sounds.pauseAudio("endboss_walking");
    }
  }
}
