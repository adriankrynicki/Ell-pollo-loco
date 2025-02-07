/**
 * Each function manages the visibility and content of specific game sections.
 */
const sectionHandlers = {
  info: () => {
    updateGameContainer("info");
    showControls();
  },
  play: () => updateGameContainer("play"),
  credits: () => {
    updateGameContainer("credits");
    updateCreditsContainer("legalNotice");
  },
  legalNotice: () => updateCreditsContainer("legalNotice"),
  privacyPolicy: () => updateCreditsContainer("privacyPolicy"),
};

/**
 * Global variables for UI elements
 */
const uiElements = {
  main: document.getElementsByTagName("main")[0],
  nav: document.getElementById("nav-controls"),
  audio: document.getElementById("audio-controls"),
  time: document.getElementById("time-container"),
  musicOff: document.getElementById("music-off"),
  musicOn: document.getElementById("music-on"),
  soundOn: document.getElementById("sound-on"),
  soundOff: document.getElementById("sound-off"),
  playGameButton: document.getElementById("playGameButton"),
  pauseButton: document.getElementById("pause-game"),
  gameContainer: document.getElementById("game-container"),
  loadingText: document.getElementById("loadingText"),
  touchControls: document.getElementById("responsive-buttons-container"),
};

/**
 * Global variables for sound and music state
 */
let soundsPlaying = false;
let musicPlaying = false;
let isLandscape = false;

/**
 * Prepering for navigation in main menu
 */
function initializeNavigationListeners() {
  document.addEventListener("click", (e) => {
    let button = e.target.closest("[data-section]");
    if (!button) return;

    let section = button.dataset.section;
    if (sectionHandlers[section]) {
      sectionHandlers[section]();
    }
  });
}

/**
 * Prepering audio buttons for user input
 */
function initializeAudioListeners() {
  uiElements.audio.addEventListener("click", (e) => {
    let target = e.target;
    if (target.matches("#sound-on, #sound-off")) {
      handleSoundToggle();
    } else if (target.matches("#music-on, #music-off")) {
      handleMusicToggle();
    }
  });
  uiElements.pauseButton.addEventListener("click", openInGameMenu);
}

/**
 * Shows play game button
 */
function initializePlayGameButton() {
  uiElements.gameContainer.innerHTML = playGameButtonHTML();
}

/**
 * Updates game container based on section
 * @param {string} section - The section to update
 */
function updateGameContainer(section) {
  let contentMap = {
    info: controlsButtonsHTML,
    credits: creditsButtonsHTML,
    play: playGameButtonHTML,
  };

  if (contentMap[section]) {
    uiElements.gameContainer.innerHTML = contentMap[section]();
  }
}

/**
 * Updates credits container based on section
 * @param {string} section - The section to update
 */
function updateCreditsContainer(section) {
  let contentMap = {
    privacyPolicy: privacyPolicyHTML,
    legalNotice: legalNoticeHTML,
  };

  if (contentMap[section]) {
    let creditsContent = document.getElementById("credits-content");
    if (creditsContent) {
      creditsContent.innerHTML = contentMap[section]();
    } else {
      console.error("Not found credits-content");
    }
  }
}

/**
 * Shows start screen and removes UI elements
 */
function updateUIElements() {
  canvas.classList.add("d-none");
  uiElements.nav.classList.add("nav-controls");
  uiElements.nav.classList.remove("d-none");
  uiElements.audio.classList.remove("audio-controls");
  uiElements.audio.classList.add("d-none");
  uiElements.main.classList.add("start-screen");
  uiElements.time.classList.add("d-none");
  uiElements.time.classList.remove("time-container");
}

/**
 * Updates music button visibility based on music state
 * @param {boolean} isMusicOff - Determines which music button to display
 */
function toggleMusicButtons(isMusicOff) {
  if (isMusicOff) {
    uiElements.musicOn.classList.add("d-none");
    uiElements.musicOn.classList.remove("button-style", "audio-button");
    uiElements.musicOff.classList.remove("d-none");
    uiElements.musicOff.classList.add("button-style", "audio-button");
    musicPlaying = false;
  } else {
    uiElements.musicOn.classList.remove("d-none");
    uiElements.musicOn.classList.add("button-style", "audio-button");
    uiElements.musicOff.classList.add("d-none");
    uiElements.musicOff.classList.remove("button-style", "audio-button");
    musicPlaying = true;
  }
}

/**
 * Updates sound button visibility based on sound state
 * @param {boolean} isSoundOff - Determines which sound button to display
 */
function toggleSoundButtons(isSoundOff) {
  if (isSoundOff) {
    uiElements.soundOn.classList.add("d-none");
    uiElements.soundOn.classList.remove("button-style", "audio-button");
    uiElements.soundOff.classList.remove("d-none");
    uiElements.soundOff.classList.add("button-style", "audio-button");
    soundsPlaying = false;
  } else {
    uiElements.soundOn.classList.remove("d-none");
    uiElements.soundOn.classList.add("button-style", "audio-button");
    uiElements.soundOff.classList.add("d-none");
    uiElements.soundOff.classList.remove("button-style", "audio-button");
    soundsPlaying = true;
  }
}

/**
 * Play the sound or stop it
 */
function handleSoundToggle() {
  const world = getWorld();
  let isSoundOn = uiElements.soundOff.classList.contains("d-none");
  if (world && world.services.sounds) {
    world.services.sounds.toggleGameSounds(!isSoundOn);
    toggleSoundButtons(isSoundOn);
  }
}

/**
 * Play the music or stop it
 */
function handleMusicToggle() {
  const world = getWorld();
  let isMusicOn = uiElements.musicOff.classList.contains("d-none");
  if (world && world.services.sounds) {
    world.services.sounds.toggleMusic(!isMusicOn);
    toggleMusicButtons(isMusicOn);
  }
}

/**
 * Main function to handle returning to menu
 */
function backToMenu() {
  clearGameContainer();
  resetGameState();
  handleGameTimeout();
  setupMenuUI();
}

/**
 * Clears the game container content
 */
function clearGameContainer() {
  uiElements.gameContainer.innerHTML = "";
}

/**
 * Resets the game state and touch controls
 */
function resetGameState() {
  const world = getWorld();
  if (!world) return;

  world.resetGame();
  updateTouchControls();
}

/**
 * Handles game timeout cleanup
 */
function handleGameTimeout() {
  if (!gameOverTimeout) return;

  clearTimeout(gameOverTimeout);
  stopTimer();
  gameOverTimeout = null;
}

/**
 * Sets up the menu UI elements
 */
function setupMenuUI() {
  updateUIElements();
  uiElements.gameContainer.classList.add("game-container");
  uiElements.gameContainer.innerHTML = playGameButtonHTML();
}

/**
 * Main function to handle opening the in-game menu
 */
function openInGameMenu() {
  pauseGameState();
  handleGameAudio();
  updateInGameUI();
}

/**
 * Pauses the game state and keyboard controls
 */
function pauseGameState() {
  const world = getWorld();
  keyboardActive = false;
  world.pauseGame();
}

/**
 * Handles game audio when opening menu
 */
function handleGameAudio() {
  const world = getWorld();
  if (!world?.services.sounds) return;

  world.services.sounds.toggleGameSounds(true);
  world.services.sounds.toggleMusic(true);
}

/**
 * Updates UI elements for in-game menu
 */
function updateInGameUI() {
  uiElements.gameContainer.innerHTML = inGameMenuHTML();
  updateTouchControls();
}

/**
 * Updates touch control visibility
 */
function updateTouchControls() {
  uiElements.touchControls.classList.add("d-none");
  uiElements.touchControls.classList.remove("responsive-buttons-container");
}

/**
 * Main function to handle closing the in-game menu
 */
function closeInGameMenu() {
  resumeGameState();
  restoreGameAudio();
  resetGameUI();
}

/**
 * Resumes the game state and keyboard controls
 */
function resumeGameState() {
  const world = getWorld();
  keyboardActive = true;
  resetKeyboard();
  world.resumeGame();
}

/**
 * Restores game audio to previous state
 */
function restoreGameAudio() {
  const world = getWorld();
  if (!world?.services.sounds) return;

  world.services.sounds.toggleGameSounds(soundsPlaying);
  world.services.sounds.toggleMusic(musicPlaying);
}

/**
 * Resets UI elements when closing menu
 */
function resetGameUI() {
  uiElements.gameContainer.innerHTML = "";
  showTouchControls();
}

/**
 * Shows touch controls
 */
function showTouchControls() {
  uiElements.touchControls.classList.remove("d-none");
  uiElements.touchControls.classList.add("responsive-buttons-container");
}

/**
 * Delete current game and start new one
 */
function restartGame() {
  World.instance = null;
  handleGameTimeout();
  playGame();
  updateRestartUI();
}

/**
 * Stops active game timer and clears timeout references
 */
function handleGameTimeout() {
  if (!gameOverTimeout) return;

  clearTimeout(gameOverTimeout);
  stopTimer();
  gameOverTimeout = null;
}

/**
 * Removing UI elements for restart
 */
function updateRestartUI() {
  uiElements.gameContainer.innerHTML = "";
  canvas.classList.add("d-none");
  uiElements.audio.classList.add("d-none");
  uiElements.audio.classList.remove("audio-controls");
  uiElements.time.classList.add("d-none");
  uiElements.time.classList.remove("time-container");
  uiElements.touchControls.classList.add("d-none");
  uiElements.touchControls.classList.remove("responsive-buttons-container");
}

/**
 * Shows info about chracter controls
 */
function showControls() {
  let infoContent = document.getElementById("info-content");
  infoContent.innerHTML = controlsHTML();
}

/**
 * Shows how to play the game
 */
function showGameMechanics() {
  let infoContent = document.getElementById("info-content");
  infoContent.innerHTML = gameMechanicsHTML();
}

/**
 * Decides what to show when game ends (win or lose)
 */
function handleGameEndHTMLElements() {
  const world = getWorld();
  world.services.gameStateManager.setGameEndCallback(handleGameEnd);
}

/**
 * Handles game end and UI updates
 * @param {Object} gameState - The final game state
 */
function handleGameEnd(gameState = {}) {
  updateGameEndUI();
  stopTimer();
  setGameOverTimeout(gameState);
}

/**
 * Removes UI elements for game end
 */
function updateGameEndUI() {
  const elementsToUpdate = [
    { element: uiElements.audio, add: ["d-none"], remove: ["audio-controls"] },
    { element: uiElements.time, add: ["d-none"], remove: ["time-container"] },
  ];

  elementsToUpdate.forEach(({ element, add, remove }) => {
    add.forEach((className) => element.classList.add(className));
    remove.forEach((className) => element.classList.remove(className));
  });
}

/**
 * Sets timeout for game over screen
 * @param {Object} gameState - The final game state
 */
function setGameOverTimeout(gameState) {
  gameOverTimeout = setTimeout(() => {
    showGameOverScreen(gameState);
    updateTouchControls();
  }, 4000);
}

/**
 * Shows the game over screen with final state
 * @param {Object} gameState - The final game state
 */
function showGameOverScreen(gameState) {
  uiElements.gameContainer.innerHTML = gameOverHTML(gameState);
}

/**
 * Checks the orientation of the device and shows the rotation overlay if it is in portrait mode
 */
function checkOrientation() {
  let overlay = document.getElementById("rotation-overlay");
  let isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const world = getWorld();

  if (isPortrait) {
    handlePortraitMode(overlay, world);
  } else {
    handleLandscapeMode(overlay, world);
  }
}

/**
 * Shows image with instructions to rotate the device and pauses the game if it exists
 * @param {HTMLElement} overlay - The rotation overlay element
 * @param {Object} world - The current game world instance
 */
function handlePortraitMode(overlay, world) {
  overlay.classList.remove("d-none");
  overlay.classList.add("rotation-overlay");
  pauseGameIfExists(world);
}

/**
 * Pauses the game if it exists
 * @param {Object} world - The current game world instance
 */
function pauseGameIfExists(world) {
  if (world) {
    world.pauseGame();
    keyboardActive = false;
  }
}

/**
 * Hides image with instructions to rotate the device and resumes the game if it was paused
 * @param {HTMLElement} overlay - The rotation overlay element
 * @param {Object} world - The current game world instance
 */
function handleLandscapeMode(overlay, world) {
  overlay.classList.add("d-none");
  overlay.classList.remove("rotation-overlay");
  resumeGameIfPaused(world);
}

/**
 * Resumes the game if it was paused
 * @param {Object} world - The current game world instance
 */
function resumeGameIfPaused(world) {
  if (world && world.gameState.gamePaused) {
    world.resumeGame();
    keyboardActive = true;
  }
}

/**
 * Adds event listeners for checking the orientation of the device
 */
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", () => {
  setTimeout(checkOrientation, 200);
});

/**
 * Initializes navigation and audio listeners
 */
initializeNavigationListeners();
initializeAudioListeners();
document.addEventListener("DOMContentLoaded", () => {
  initializePlayGameButton();
  checkOrientation();
});
