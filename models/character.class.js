class Character extends MovableObject {
  hp = 1000;
  x = 100;
  y = 160;
  width = 135;
  height = 270;
  speed = 600;
  isSleeping = false;
  userIsPlaying = false;
  characterIsDead = false;
  sleepCountdown = 0;
  isInBossArea = false;
  jumpActive = false;
  canJumpAgain = true;
  throwActive = false;

  // Kollisions-Offset für präzisere Hitboxen
  offset = {
    top: 115,
    left: 25,
    right: 40,
    bottom: 15,
  };

  constructor(services) {
    super();
    this.services = services;
    this.world = services.world;
    this.animationManager = services.animationManager;

    // Nur Bilder laden im Constructor
    this.loadImage(CharacterImages.IMAGES_IDLE[0]);
    this.loadAllCharacterImages();
  }

  initialize(level) {
    this.services.world.level = level;

    // Debug logs hinzufügen
    this.animationManager.addAnimation({
      update: (deltaTime) => {
        if (deltaTime === 0) return;

        if (
          this.services.world.level &&
          !this.services.world.gameState.gamePaused
        ) {
          this.applyGravity(deltaTime);
          this.handleCharacterState(deltaTime);
        }
      },
    });
  }

  loadAllCharacterImages() {
    this.loadImages(CharacterImages.IMAGES_IDLE);
    this.loadImages(CharacterImages.IMAGES_WALKING);
    this.loadImages(CharacterImages.IMAGES_JUMPING);
    this.loadImages(CharacterImages.IMAGES_JUMPING_SHORT);
    this.loadImages(CharacterImages.IMAGES_BOTTLE_THROW);
    this.loadImages(CharacterImages.IMAGES_WIN_DANCE);
    this.loadImages(CharacterImages.IMAGES_HURT);
    this.loadImages(CharacterImages.IMAGES_DEAD);
    this.loadImages(CharacterImages.IMAGES_SLEEP);
  }

  characterStates = [
    {
      condition: () => this.noCharacterInteraction(),
      execute: (deltaTime) => {
        this.userIsPlaying = false;
      },
    },
    {
      condition: () => this.isHurt(),
      execute: (deltaTime) => {
        this.hurtAction(deltaTime);
        this.playAnimation(CharacterImages.IMAGES_HURT, deltaTime, 60);
      },
      sound: "character_hurt",
    },
    {
      condition: () => this.isDead(),
      execute: (deltaTime) => {
        this.deadState();
        this.playAnimation(CharacterImages.IMAGES_DEAD, deltaTime, 10);
      },
      sound: "character_dead",
    },
    {
      condition: () =>
        this.world.keyboard.D &&
        this.services.bottleThrowManager.canThrowBottle(),
      execute: (deltaTime) => {
        this.throwActive = true;
        this.services.bottleThrowManager.manageBottleThrow();
        this.currentImage = 0;
        this.playAnimation(CharacterImages.IMAGES_BOTTLE_THROW, deltaTime, 60);
      },
      sound: "bottle_throw",
    },
    {
      condition: () => this.services.world.keyboard.LEFT && this.canMoveLeft(),
      execute: (deltaTime) => {
        this.walkLeft(deltaTime);
        this.walkAnimation(deltaTime);
        return { playSound: true };
      },
      sound: "character_walking",
    },
    {
      condition: () =>
        this.services.world.keyboard.RIGHT &&
        this.levelEndReached() &&
        this.services.collisionHandler.canMoveRight,
      execute: (deltaTime) => {
        this.walkRight(deltaTime);
        this.walkAnimation(deltaTime);
        return { playSound: true };
      },
      sound: "character_walking",
    },
    {
      condition: () =>
        (this.services.world.keyboard.UP &&
          this.canJumpAgain &&
          !this.isAboveGround()) ||
        this.jumpActive,
      execute: (deltaTime) => {
        const jumpResult = this.performJump(deltaTime);
        this.animateJump(deltaTime);
        return jumpResult;
      },
      sound: "jump",
    },
    {
      condition: () =>
        !this.services.world.keyboard.UP && !this.isAboveGround(),
      execute: (deltaTime) => {
        this.canJumpAgain = true;
      },
    },
    {
      condition: () =>
        !this.userIsPlaying && !this.isSleeping && !this.jumpActive,
      execute: (deltaTime) => {
        this.startSleepingTimer(deltaTime);
        this.playAnimation(CharacterImages.IMAGES_IDLE, deltaTime, 6);
      },
    },
    {
      condition: () => !this.userIsPlaying && this.isSleeping,
      execute: (deltaTime) => {
        this.playAnimation(CharacterImages.IMAGES_SLEEP, deltaTime, 6);
        this.services.sounds.playAudio("snoring");
      },
      sound: "snoring",
    },
    {
      condition: () => this.userIsPlaying,
      execute: (deltaTime) => {
        this.clearSleepingTimer();
      },
    },
    {
      condition: () =>
        this.services.collectablesObjects.hasReachedCoinThreshold &&
        this.services.world.keyboard.S,
      execute: (deltaTime) => {
        this.services.collectablesObjects.restoreCharacterHealth();
      },
    },
  ];

  handleCharacterState(deltaTime) {
    if (this.services.world.gameState.gameWon) {
      this.playAnimation(CharacterImages.IMAGES_WIN_DANCE, deltaTime, 10);
      return;
    }

    let activeStates = this.characterStates.filter((state) =>
      state.condition()
    );

    this.pauseWalkSound();
    this.pauseSnoringSound();

    activeStates.forEach((state) => {
      let result = state.execute(deltaTime);
      if (state.sound && result?.playSound) {
        this.services.sounds.playAudio(state.sound);
      }
    });
  }

  pauseWalkSound() {
    if (
      (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) ||
      this.isAboveGround()
    ) {
      this.services.sounds.pauseAudio("character_walking");
    }
  }

  pauseSnoringSound() {
    if (this.userIsPlaying) {
      this.services.sounds.pauseAudio("snoring");
      this.clearSleepingTimer();
    }
  }

  noCharacterInteraction() {
    return (
      !this.services.world.keyboard.LEFT &&
      !this.services.world.keyboard.RIGHT &&
      !this.services.world.keyboard.UP &&
      !this.services.world.keyboard.D &&
      !this.isHurt() &&
      !this.isDead()
    );
  }

  walkAnimation(deltaTime) {
    if (
      !this.isAboveGround() &&
      !this.jumpActive &&
      !this.throwActive
    ) {
      this.playAnimation(CharacterImages.IMAGES_WALKING, deltaTime, 15);
    }
  }

  walkLeft(deltaTime) {
    this.moveLeft(deltaTime);
    this.otherDirection = true;
    this.userIsPlaying = true;
    this.updateCameraPosition();
  }

  walkRight(deltaTime) {
    this.moveRight(deltaTime);
    this.otherDirection = false;
    this.userIsPlaying = true;
    this.updateCameraPosition();
  }

  hurtAction(deltaTime) {
    this.clearSleepingTimer();
  }

  deadState() {
    this.characterIsDead = true;
  }

  animateJump(deltaTime) {
    if (
      !this.jumpActive &&
      !this.isAboveGround() &&
      this.services.world.keyboard.UP
    ) {
      this.jumpActive = true;
      this.currentImage = 0;
    }

    if (this.jumpActive) {
      this.playAnimation(CharacterImages.IMAGES_JUMPING, deltaTime, 6.5);
      if (!this.isAboveGround() && this.speedY === 0) {
        this.jumpActive = false;
        this.currentImage = 0;
      }
    }
  }

  performJump(deltaTime) {
    if (!this.isAboveGround() && this.canJumpAgain) {
      this.speedY = -480;
      this.userIsPlaying = true;
      this.canJumpAgain = false;
      return { playSound: true }; // Sound nur beim Initiieren des Sprungs
    }
    return { playSound: false };
  }

  performShortJump(deltaTime) {
    this.speedY = -300;
    this.userIsPlaying = true;
    this.isShortJumpAnimationComplete = false;
    if (this.isAboveGround()) {
      this.isShortJumpAnimationComplete = true;
    }
  }

  startSleepingTimer(deltaTime) {
    if (this.world.gamePaused) return;

    if (!this.sleepCountdown) this.sleepCountdown = 0;
    this.sleepCountdown += deltaTime;
    if (this.sleepCountdown >= 10000 && !this.isSleeping) {
      this.isSleeping = true;
    }
  }

  clearSleepingTimer() {
    this.sleepCountdown = 0;
    this.isSleeping = false;
    this.services.sounds.pauseAudio("snoring");
  }

  levelEndReached() {
    return this.x < this.world?.level?.level_end_x;
  }

  canMoveLeft() {
    return this.x > 0;
  }

  inBossArea() {
    this.isInBossArea = true;
  }

  updateCameraPosition() {
    this.services.world.camera_x = -this.x + 100;
  }
}
