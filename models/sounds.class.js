class Sounds {

  constructor() {
    this.audioElements = {};
    this.initialized = false;
    this.gameSoundsMuted = false;
    this.musicMuted = false;
  }

  initializeAudioElements() {
    this.audioElements = {
      "background_music": new Audio("audio/background_music.mp3"),
      "bottle_splash": new Audio("audio/bottle_splash.mp3"),
      "bottle_throw": new Audio("audio/bottle_throw.mp3"),
      "bottle_collect": new Audio("audio/bottle_collect.mp3"),
      "character_hurt": new Audio("audio/character_hurt.mp3"),
      "character_dead": new Audio("audio/character_dead.mp3"),
      "chicken": new Audio("audio/chicken.mp3"),
      "coin": new Audio("audio/coin.mp3"),
      "endboss": new Audio("audio/endboss.mp3"),
      "endboss_dead": new Audio("audio/endboss_dead.mp3"),
      "jump": new Audio("audio/jump.mp3"),
      "small_chicken": new Audio("audio/small_chicken.mp3"),
      "walk": new Audio("audio/walk.mp3"),
      "snoring": new Audio("audio/snoring.mp3"),
      "win": new Audio("audio/win.mp3"),
      "lose": new Audio("audio/game_over.mp3"),
    };
  }

  initializeAudio() {
    if (!this.initialized) {
      this.initializeAudioElements();
      this.audioContext = new AudioContext();
      
      const loadPromises = Object.values(this.audioElements).map(audio => {
        return new Promise((resolve) => {
          audio.preload = "auto";
          audio.load();
          audio.addEventListener('canplaythrough', resolve, { once: true });
        });
      });
      
      Promise.all(loadPromises).then(() => this.initialized = true);
      
      return true;
    }
    return false;
  }

  async playAudio(audioName) {
    const audio = this.audioElements[audioName];
    if (!audio || !this.initialized) return;
    
    try {
        audio.muted = this.gameSoundsMuted;
        audio.volume = 1.0;
        
        if (audioName === "background_music" || audioName === "snoring") {
            audio.loop = true;
            if (!this.isPlaying(audioName)) {
                await audio.play();
            }
        } else {
            await audio.play();
        }
    } catch (error) {}
  }

  toggleGameSounds(shouldMute) {
    this.gameSoundsMuted = shouldMute;
    Object.entries(this.audioElements).forEach(([key, audio]) => {
        if (key !== 'background_music') {
            audio.muted = shouldMute;
        }
    });
  }

  toggleMusic(shouldMute) {
    this.musicMuted = shouldMute;
    const backgroundMusic = this.audioElements['background_music'];
    if (backgroundMusic) {
        if (shouldMute) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        } else {
            backgroundMusic.play();
            backgroundMusic.loop = true;
        }
        backgroundMusic.muted = shouldMute;
    }
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
