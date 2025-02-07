/**
 * Manages all game audio elements and their states.
 * Handles loading, playing, and controlling game sounds and music.
 */
class Sounds {
  /**
   * Creates a new Sounds instance and initializes basic audio states
   */
  constructor() {
    /**
     * @type {Object.<string, HTMLAudioElement>} Collection of all game audio elements
     */
    this.audioElements = {};

    /**
     * @type {boolean} Indicates if audio elements have been initialized
     */
    this.initialized = false;

    /**
     * @type {boolean} Indicates if game sound effects are muted
     */
    this.gameSoundsMuted = false;

    /**
     * @type {boolean} Indicates if background music is muted
     */
    this.musicMuted = false;
  }

  /**
   * Initializes all game audio elements with their respective audio files.
   */
  initializeAudioElements() {
    this.audioElements = {
      background_music: new Audio("audio/background_music.mp3"),
      bottle_splash: new Audio("audio/bottle_splash.mp3"),
      bottle_throw: new Audio("audio/bottle_throw.mp3"),
      bottle_collect: new Audio("audio/bottle_collect.mp3"),
      character_hurt: new Audio("audio/character_hurt.mp3"),
      character_dead: new Audio("audio/character_dead.mp3"),
      chicken_dead: new Audio("audio/chicken.mp3"),
      coin_collect: new Audio("audio/coin.mp3"),
      endboss_attack: new Audio("audio/endboss_attack.mp3"),
      endboss_hurt: new Audio("audio/endboss_hurt.mp3"),
      endboss_dead: new Audio("audio/endboss_dead.mp3"),
      endboss_walking: new Audio("audio/endboss_walking.mp3"),
      jump: new Audio("audio/jump.mp3"),
      smallchicken_dead: new Audio("audio/small_chicken.mp3"),
      character_walking: new Audio("audio/character_walking.mp3"),
      snoring: new Audio("audio/snoring.mp3"),
      hp_restored: new Audio("audio/hp_restored.mp3"),
      win: new Audio("audio/win.mp3"),
      lose: new Audio("audio/game_over.mp3"),
    };
  }

  /**
   * Initializes all game audio elements and sets up the audio context.
   * @returns {boolean} - True if initialization was successful, false otherwise
   */
  initializeAudio() {
    if (!this.initialized) {
      this.initializeAudioElements();
      this.setupAudioContext();
      this.loadAllAudioElements();
      return true;
    }
    return false;
  }

  /**
   * Sets up the audio context for audio playback.
   */
  setupAudioContext() {
    this.audioContext = new AudioContext();
  }

  /**
   * Loads all audio elements asynchronously and updates the initialization state.
   */
  loadAllAudioElements() {
    const loadPromises = this.createLoadPromises();
    this.handleAudioLoading(loadPromises);
  }

  /**
   * Creates an array of promises for loading all audio elements.
   * @returns {Promise<void>[]} - Array of promises for loading audio elements
   */
  createLoadPromises() {
    return Object.values(this.audioElements).map((audio) => {
      return this.createSingleLoadPromise(audio);
    });
  }

  /**
   * Creates a single promise for loading an audio element.
   * @param {HTMLAudioElement} audio - The audio element to load
   * @returns {Promise<void>} - Promise for loading the audio element
   */
  createSingleLoadPromise(audio) {
    return new Promise((resolve) => {
      this.setupAudioPreload(audio);
      audio.addEventListener("canplaythrough", resolve, { once: true });
    });
  }

  /**
   * Sets up the audio element for preloading.
   * @param {HTMLAudioElement} audio - The audio element to preload
   */
  setupAudioPreload(audio) {
    audio.preload = "auto";
    audio.load();
  }

  /**
   * Handles the loading of all audio elements and updates the initialization state.
   * @param {Promise<void>[]} loadPromises - Array of promises for loading audio elements
   */
  handleAudioLoading(loadPromises) {
    Promise.all(loadPromises).then(() => {
      this.initialized = true;
    });
  }

  /**
   * Plays the specified audio element.
   * @param {string} audioName - The name of the audio element to play
   */
  async playAudio(audioName) {
    let audio = this.audioElements[audioName];
    if (!audio || !this.initialized) return;

    try {
      this.setupAudioSettings(audio);
      await this.handleAudioPlayback(audio, audioName);
    } catch (error) {}
  }

  /**
   * Sets up the audio settings for the specified audio element.
   * @param {HTMLAudioElement} audio - The audio element to configure
   */
  setupAudioSettings(audio) {
    audio.muted = this.gameSoundsMuted;
    audio.volume = 1.0;
  }

  /**
   * Handles the playback of the specified audio element.
   * @param {HTMLAudioElement} audio - The audio element to play
   * @param {string} audioName - The name of the audio element to play
   */
  async handleAudioPlayback(audio, audioName) {
    if (this.isBackgroundSound(audioName)) {
      await this.playBackgroundSound(audio, audioName);
    } else if (audioName === "character_dead") {
      await this.playOneTimeSound(audio);
    } else if (
      audioName === "endboss_hurt" ||
      audioName === "coin_collect" ||
      audioName === "bottle_collect"
    ) {
      await this.fastRepeat(audio);
    } else {
      await this.playRegularSound(audio, audioName);
    }
  }

  /**
   * Plays a sound only once and then mutes it
   * @param {HTMLAudioElement} audio - The audio element to play once
   */
  async playOneTimeSound(audio) {
    if (!audio.hasPlayed) {
      await audio.play();
      audio.hasPlayed = true;
      audio.muted = true;
    }
  }

  /**
   * Checks if the specified audio element is a background sound.
   * @param {string} audioName - The name of the audio element to check
   * @returns {boolean} - True if the audio element is a background sound, false otherwise
   */
  isBackgroundSound(audioName) {
    return audioName === "background_music" || audioName === "snoring";
  }

  /**
   * Plays the background sound.
   * @param {HTMLAudioElement} audio - The audio element to play
   * @param {string} audioName - The name of the audio element to play
   */
  async playBackgroundSound(audio, audioName) {
    audio.loop = true;
    if (!this.isPlaying(audioName)) {
      await audio.play();
    }
  }

  /**
   * Handles the fast repetition of the specified audio element.
   * @param {HTMLAudioElement} audio - The audio element to repeat
   */
  async fastRepeat(audio) {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
    await audio.play();
  }

  /**
   * Plays the specified audio element.
   * @param {HTMLAudioElement} audio - The audio element to play
   */
  async playRegularSound(audio) {
    await audio.play();
  }

  /**
   * Toggles the game sound effects on or off.
   * @param {boolean} shouldMute - True to mute, false to unmute
   */
  toggleGameSounds(shouldMute) {
    this.gameSoundsMuted = shouldMute;
    Object.entries(this.audioElements).forEach(([key, audio]) => {
      if (key !== "background_music") {
        audio.muted = shouldMute;
      }
    });
  }

  /**
   * Toggles the background music on or off.
   * @param {boolean} shouldMute - True to mute, false to unmute
   */
  toggleMusic(shouldMute) {
    this.musicMuted = shouldMute;
    const backgroundMusic = this.audioElements["background_music"];
    if (backgroundMusic) {
      this.handleMusicToggle(backgroundMusic, shouldMute);
    }
  }

  /**
   * Handles the music toggle for the background music.
   * @param {HTMLAudioElement} backgroundMusic - The background music audio element
   * @param {boolean} shouldMute - True to mute, false to unmute
   */
  handleMusicToggle(backgroundMusic, shouldMute) {
    if (shouldMute) {
      this.stopBackgroundMusic(backgroundMusic);
    } else {
      this.startBackgroundMusic(backgroundMusic);
    }
    backgroundMusic.muted = shouldMute;
  }

  /**
   * Stops the background music.
   * @param {HTMLAudioElement} backgroundMusic - The background music audio element
   */
  stopBackgroundMusic(backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }

  /**
   * Starts the background music.
   * @param {HTMLAudioElement} backgroundMusic - The background music audio element
   */
  startBackgroundMusic(backgroundMusic) {
    backgroundMusic.play();
    backgroundMusic.loop = true;
  }

  /**
   * Pauses the specified audio element.
   * @param {string} audioName - The name of the audio element to pause
   */
  pauseAudio(audioName) {
    const audio = this.audioElements[audioName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      if (audioName === "snoring") audio.loop = false;
    }
  }

  /**
   * Checks if the specified audio element is currently playing.
   * @param {string} sound - The name of the audio element to check
   * @returns {boolean} - True if the audio element is playing, false otherwise
   */
  isPlaying(sound) {
    return this.audioElements[sound] && !this.audioElements[sound].paused;
  }
}
