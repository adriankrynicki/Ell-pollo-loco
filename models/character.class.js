class Character extends MovableObject {
  x = 100;
  y = 160;
  width = 135;
  height = 270;
  speed = 15;
  world;
  isSleeping = false;
  userIsPlaying = false;
  sleepCountdown = 0;

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
      condition: () => this.isAboveGround() && !this.world?.onAnEnemy,
      state: "jumping",
      images: this.IMAGES_JUMPING,
      interval: 200,
    },
    {
      condition: () => this.isAboveGround() && this.world?.onAnEnemy,
      state: "jumpingShort",
      images: this.IMAGES_JUMPING_SHORT,
      interval: 100,
    },
    {
      condition: () => this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT,
      state: "walking",
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

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_JUMPING_SHORT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applayGravity();

    this.animate();
  }

  animate() {
    if (!this.world || !this.world.level) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    setInterval(() => {
      this.handleWalkingRight();
      this.handleWalkingLeft();
      this.handleJumpingAnimation();
      this.handleUserInput();
      this.updateCameraPosition();
      this.checkWalkSound();
    }, 60);

    this.handleAnimationStates();
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
      this.currentImage = 1;
      this.userIsPlaying = true;
    }
  }

  handleUserInput() {
    if (
      this.world.keyboard.RIGHT ||
      this.world.keyboard.LEFT ||
      this.world.keyboard.UP ||
      this.world.keyboard.D
    ) {
      this.userIsPlaying = true;
      this.isSleeping = false;
      this.clearSleepCountdown();
    } else {
      this.userIsPlaying = false;
      this.startSleeping();
    }
  }

  startSleeping() {
    if (!this.sleepCountdown) this.sleepCountdown = 0;
    this.sleepCountdown++;
    if (this.sleepCountdown >= 150 && !this.isSleeping) {
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
    const updateAnimation = () => {
      if (!this.world) {
        requestAnimationFrame(updateAnimation);
        return;
      }

      const animation = this.animations.find(a => a.condition()) || 
        { images: this.IMAGES_IDLE, interval: 220 };

      this.playAnimation(animation.images);
      setTimeout(() => requestAnimationFrame(updateAnimation), animation.interval);
    };

    updateAnimation();
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
    this.world.sounds.playAudio("character-hurt");
  }

  checkWalkSound() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
      this.world.sounds.pauseAudio("walk");
    }
    if (this.isAboveGround()) {
      this.world.sounds.pauseAudio("walk");
    }
  }
}
