class Character extends MovableObject {
  x = 100;
  y = 160;
  width = 135;
  height = 270;
  speed = 7;
  isSleeping = false;
  userIsPlaying = false;
  sleepCountdown = 0;
  bottleThrow = false;
  bottleThrowTimer = 0;
  lastAnimationUpdate = 0;
  lastStateUpdate = 0;
  isJumpAnimationComplete = false;
  isShortJumpAnimationComplete = false;
  isPerformingShortJump = false;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_JUMPING_SHORT = [
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  animations = [
    {
      condition: () => this.isHurt(),
      state: "hurt",
      images: this.IMAGES_HURT,
      interval: 100,
    },
    {
      condition: () => this.isDead(),
      state: "dead",
      images: this.IMAGES_DEAD,
      interval: 120,
    },
    {
      condition: () => this.isAboveGround() && !this.isPerformingShortJump && !this.isJumpAnimationComplete,
      state: "jumping",
      images: this.IMAGES_JUMPING,
      interval: 120,
    },
    {
      condition: () => this.isAboveGround() && this.isPerformingShortJump && !this.isShortJumpAnimationComplete,
      state: "jumpingShort",
      images: this.IMAGES_JUMPING_SHORT,
      interval: 80,
    },
    {
      condition: () => this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT,
      state: "walking",
      images: this.IMAGES_WALKING,
      interval: 60,
    },
    {
      condition: () => this.bottleThrow,
      state: "bottleThrow",
      images: this.IMAGES_WALKING,
      interval: 60,
    },
    {
      condition: () => !this.userIsPlaying && this.isSleeping,
      state: "sleeping",
      images: this.IMAGES_SLEEP,
      interval: 220,
    },
    {
      condition: () => !this.userIsPlaying && !this.isSleeping,
      state: "idle",
      images: this.IMAGES_IDLE,
      interval: 220,
    },
  ];

  constructor(world) {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.characterImages();
    this.applayGravity();
    this.world = world;

    this.animate();
  }

  characterImages() {
    let characterImages = [
      this.IMAGES_WALKING,
      this.IMAGES_JUMPING,
      this.IMAGES_JUMPING_SHORT,
      this.IMAGES_DEAD,
      this.IMAGES_HURT,
      this.IMAGES_IDLE,
      this.IMAGES_SLEEP,
    ];
    characterImages.forEach((images) => {
      this.loadImages(images);
    });
  }

  animate() {
    if (!this.world || !this.world.level) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    this.handleMovement();
    
    if (!this.lastAnimationUpdate || performance.now() - this.lastAnimationUpdate >= 50) {
      this.handleAnimations();
      this.lastAnimationUpdate = performance.now();
    }

    requestAnimationFrame(() => this.animate());
  }

  handleMovement() {
    this.handleWalkingRight();
    this.handleWalkingLeft();
    this.handleUserInput();
    this.updateCameraPosition();
  }

  handleAnimations() {
    this.handleJumpingAnimation();
    this.toggleBottleThrow();
    this.checkWalkSound();
    this.handleAnimationStates();
    this.resetJumpStates();
  }

  handleWalkingRight() {
    if (this.world.keyboard.RIGHT && this.canMoveRight()) {
      this.moveRight();
      this.world.sounds.playAudio("walk");
      this.userIsPlaying = true;
    } 
  }

  handleWalkingLeft() {
    if (this.world.keyboard.LEFT && this.canMoveLeft()) {
      this.moveLeft();
      this.world.sounds.playAudio("walk");
      this.userIsPlaying = true;
    }
  }

  handleJumpingAnimation() {
    if (this.world.keyboard.UP && !this.isAboveGround()) {
      this.speedY = -27;
      this.world.sounds.playAudio("jump");
      this.currentImage = 0;
      this.isJumpAnimationComplete = false;
      this.isShortJumpAnimationComplete = false;
      this.isPerformingShortJump = false;
      this.userIsPlaying = true;
    }
  }

  handleUserInput() {
    if (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.UP ||
      this.world.keyboard.D ||
      this.isHurt() ||
      (this.world.gamePaused && !this.isSleeping)
    ) {
      this.userIsPlaying = true;
      this.isSleeping = false;
      this.clearSleepCountdown();
    } else {
      this.userIsPlaying = false;
      this.startSleeping();
    }
  }

  isOnEnemy() {
    return this.world?.collisionHandler.onAnEnemy;
  }

  toggleBottleThrow() {
    if (this.bottleThrow) {
      this.bottleThrowTimer++;
      if (this.bottleThrowTimer === 5) {
        this.bottleThrow = false;
        this.bottleThrowTimer = 0;
      }
    }
  }

  startSleeping() {
    if (this.world.gamePaused) return;
    
    if (!this.sleepCountdown) this.sleepCountdown = 0;
    this.sleepCountdown++;
    if (this.sleepCountdown >= 300 && !this.isSleeping) {
      this.isSleeping = true;
      this.world.sounds.playAudio("snoring");
    }
  }

  clearSleepCountdown() {
    if (this.userIsPlaying) {
      this.sleepCountdown = 0;
      this.isSleeping = false;
      this.world.sounds.pauseAudio("snoring");
    }
  }

  updateCameraPosition() {
    this.world.camera_x = -this.x + 100;
  }

  handleAnimationStates() {
    const currentTime = performance.now();
    const animation = this.animations.find((a) => a.condition()) || {
        images: this.IMAGES_IDLE,
        interval: 220,
    };

    if (!this.lastStateUpdate || currentTime - this.lastStateUpdate >= animation.interval) {
        this.playAnimation(animation.images);
        
        if (this.currentImage >= animation.images.length - 1) {
            if (animation.state === "jumping") this.isJumpAnimationComplete = true;
            if (animation.state === "jumpingShort") this.isShortJumpAnimationComplete = true;
        }
        
        this.lastStateUpdate = currentTime;
    }
  }

  canMoveRight() {
    if (!this.world || !this.world.level) {
      return false;
    }
    return this.x < this.world.level.level_end_x && this.world.canMoveRight;
  }

  canMoveLeft() {
    return this.x > 0;
  }

  jumpSound() {
    this.world.sounds.playAudio("jump");
  }

  characterHurtSound() {
    this.world.sounds.playAudio("character_hurt");
  }

  characterDeadSound() {
    this.world.sounds.playAudio("character_dead");
  }

  checkWalkSound() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
      this.world.sounds.pauseAudio("walk");
    }
    if (this.isAboveGround()) {
      this.world.sounds.pauseAudio("walk");
    }
  }

  performShortJump() {
    this.speedY = -20;
    this.currentImage = 0;
    this.isShortJumpAnimationComplete = false;
    this.isPerformingShortJump = true;
    this.userIsPlaying = true;
  }

  resetJumpStates() {
    if (!this.isAboveGround()) {
      this.isJumpAnimationComplete = false;
      this.isShortJumpAnimationComplete = false;
      this.isPerformingShortJump = false;
    }
  }
}
