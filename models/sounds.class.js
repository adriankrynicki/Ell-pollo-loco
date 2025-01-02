class Sounds {
  constructor() {
    this.audioElements = {};
    this.initialized = false;
    this.gameSoundsMuted = false;
    this.musicMuted = false;
  }

  initializeAudioElements() {
    this.audioElements = {
      background_music: new Audio("audio/background_music.mp3"),
      bottle_splash: new Audio("audio/bottle_splash.mp3"),
      bottle_throw: new Audio("audio/bottle_throw.mp3"),
      bottle_collect: new Audio("audio/bottle_collect.mp3"),
      character_hurt: new Audio("audio/character_hurt.mp3"),
      character_dead: new Audio("audio/character_dead.mp3"),
      chicken: new Audio("audio/chicken.mp3"),
      coin: new Audio("audio/coin.mp3"),
      endboss: new Audio("audio/endboss.mp3"),
      endboss_dead: new Audio("audio/endboss_dead.mp3"),
      jump: new Audio("audio/jump.mp3"),
      small_chicken: new Audio("audio/small_chicken.mp3"),
      walk: new Audio("audio/walk.mp3"),
      snoring: new Audio("audio/snoring.mp3"),
      hp_restored: new Audio("audio/hp_restored.mp3"),
      win: new Audio("audio/win.mp3"),
      lose: new Audio("audio/game_over.mp3"),
    };
  }

  initializeAudio() {
    if (!this.initialized) {
      this.initializeAudioElements();
      this.setupAudioContext();
      this.loadAllAudioElements();
      return true;
    }
    return false;
  }

  setupAudioContext() {
    this.audioContext = new AudioContext();
  }

  loadAllAudioElements() {
    const loadPromises = this.createLoadPromises();
    this.handleAudioLoading(loadPromises);
  }

  createLoadPromises() {
    return Object.values(this.audioElements).map((audio) => {
      return this.createSingleLoadPromise(audio);
    });
  }

  createSingleLoadPromise(audio) {
    return new Promise((resolve) => {
      this.setupAudioPreload(audio);
      audio.addEventListener("canplaythrough", resolve, { once: true });
    });
  }

  setupAudioPreload(audio) {
    audio.preload = "auto";
    audio.load();
  }

  handleAudioLoading(loadPromises) {
    Promise.all(loadPromises).then(() => {
      this.initialized = true;
    });
  }

  async playAudio(audioName) {
    const audio = this.audioElements[audioName];
    if (!audio || !this.initialized) return;

    try {
      this.setupAudioSettings(audio);
      await this.handleAudioPlayback(audio, audioName);
    } catch (error) {}
  }

  setupAudioSettings(audio) {
    audio.muted = this.gameSoundsMuted;
    audio.volume = 1.0;
  }

  async handleAudioPlayback(audio, audioName) {
    if (this.isBackgroundSound(audioName)) {
      await this.playBackgroundSound(audio, audioName);
    } else if (audioName === "endboss") {
      await this.playEndbossSound(audio);
    } else {
      await this.playRegularSound(audio);
    }
  }

  isBackgroundSound(audioName) {
    return audioName === "background_music" || audioName === "snoring";
  }

  async playBackgroundSound(audio, audioName) {
    audio.loop = true;
    if (!this.isPlaying(audioName)) {
      await audio.play();
    }
  }

  async playEndbossSound(audio) {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    await audio.play();
  }

  async playRegularSound(audio) {
    await audio.play();
  }

  toggleGameSounds(shouldMute) {
    this.gameSoundsMuted = shouldMute;
    Object.entries(this.audioElements).forEach(([key, audio]) => {
      if (key !== "background_music") {
        audio.muted = shouldMute;
      }
    });
  }

  toggleMusic(shouldMute) {
    this.musicMuted = shouldMute;
    const backgroundMusic = this.audioElements["background_music"];
    if (backgroundMusic) {
      this.handleMusicToggle(backgroundMusic, shouldMute);
    }
  }

  handleMusicToggle(backgroundMusic, shouldMute) {
    if (shouldMute) {
      this.stopBackgroundMusic(backgroundMusic);
    } else {
      this.startBackgroundMusic(backgroundMusic);
    }
    backgroundMusic.muted = shouldMute;
  }

  stopBackgroundMusic(backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  startBackgroundMusic(backgroundMusic) {
    backgroundMusic.play();
    backgroundMusic.loop = true;
  }

  pauseAudio(audioName) {
    const audio = this.audioElements[audioName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      if (audioName === "snoring") audio.loop = false;
    }
  }

  isPlaying(sound) {
    return this.audioElements[sound] && !this.audioElements[sound].paused;
  }
}
