/**
 * Helper function to get the World instance
 * @returns {World} The current World instance
 */
const getWorld = () => {
  try {
      return World.getInstance();
  } catch (e) {
      return null;
  }
};

/**
 * Object with functions for handling touch input on mobile devices
 * @type {Object}
 */
const controls = {
  left: (isPressed) => {
    keyboard.LEFT = isPressed;
  },
  right: (isPressed) => {
    keyboard.RIGHT = isPressed;
  },
  jump: (isPressed) => {
    keyboard.UP = isPressed;
  },
  throwBottle: (isPressed) => {
    keyboard.D = isPressed;
  },
  heal: (isPressed) => {
    keyboard.S = isPressed;
  },
};

/**
 * Global variables for the game
 * @type {Object}
 */
let canvas;
let keyboardActive = false;
let keyboard = new Keyboard();
let gameOverTimeout;
let timerInterval;
let currentFormattedTime = "0:00:00";
let finalGameTime = "0:00:00";

/**
 * Starts the game and initializes all necessary components
 */
async function playGame() {
  prepareUIForGameStart();
  initializeWorld();

  try {
    await loadGameResources();
    finalizeGameStart();
    startTimer();
  } catch (error) {
    console.error("Error loading game resources:", error);
  }
}

/**
 * Prepares the UI for the game start
 */
function prepareUIForGameStart() {
  uiElements.main.classList.remove("start-screen");
  uiElements.nav.classList.add("d-none");
  uiElements.nav.classList.remove("nav-controls");
  uiElements.loadingText.classList.remove("d-none");
  uiElements.loadingText.classList.add("loading-text");
  uiElements.gameContainer.classList.remove("game-container");
  uiElements.gameContainer.innerHTML = "";
}

/**
 * Initializes the game world and resets necessary parameters
 */
function initializeWorld() {
  canvas = document.getElementById("canvas");
  World.instance = null;
  new World(canvas, keyboard);

  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
  }

  handleGameEndHTMLElements();
}

/**
 * Loads the game resources and initializes the level
 */
async function loadGameResources() {
  const world = getWorld();
  await Promise.all([
    initializeLevel1(world.services),
    new Promise((resolve) => {
      world.services.sounds.initializeAudio();
      world.services.sounds.toggleGameSounds(true);
      resolve();
    }),
    new Promise((resolve) => setTimeout(resolve, 4000)),
  ]);
}

/**
 * Finalizes the game start and sets up the game environment
 */
function finalizeGameStart() {
  const world = getWorld();
  updateUIForGameStart();
  toggleSoundButtons(false);
  toggleMusicButtons(false);
  responsiveButtons();
  keyboardActivation();

  canvas.classList.remove("d-none");
  world.setLevel(level1);
}

/**
 * Removing loading screen and adding time and audio controls
 */
function updateUIForGameStart() {
  uiElements.loadingText.classList.add("d-none");
  uiElements.loadingText.classList.remove("loading-text");
  uiElements.time.classList.remove("d-none");
  uiElements.time.classList.add("time-container");
  uiElements.audio.classList.remove("d-none");
  uiElements.audio.classList.add("audio-controls");
}

/**
 * Handles the responsive buttons for mobile devices
 */
function responsiveButtons() {
  const hasPhysicalKeyboard =
    window.matchMedia("(pointer: fine)").matches &&
    !("ontouchstart" in window || navigator.maxTouchPoints > 0);

  if (!hasPhysicalKeyboard) {
    uiElements.touchControls.classList.remove("d-none");
    uiElements.touchControls.classList.add("responsive-buttons-container");
    uiElements.touchControls.innerHTML = responsiveControlsHTML();
  }
}

function keyboardActivation() {
  setTimeout(() => {
    keyboardActive = true;
  }, 600);
}

/**
 * Initializes the timer variables for the game
 */
function initializeTimerVariables() {
  window.gameTime = {
    total: 0,
    lastUpdate: 0,
    container: document.getElementById("time-container"),
  };
}

/**
 * Starts the timer and initializes the timer variables
 */
function startTimer() {
  resetTimerIfExists();
  initializeTimerVariables();
  startTimerLoop();
}

/**
 * Resets the timer if it exists
 */
function resetTimerIfExists() {
  if (timerInterval) {
    cancelAnimationFrame(timerInterval);
  }
}

/**
 * Starts the timer loop
 */
function startTimerLoop() {
  timerInterval = requestAnimationFrame(updateTimer);
}

/**
 * Updates the timer and handles the game state
 * @param {number} timestamp - The current timestamp
 */
function updateTimer(timestamp) {
  const world = getWorld();
  if (!world?.gameState.gamePaused) {
    updateTimeIfNeeded(timestamp);
  }
  if (world && !world.gameState.gameOver) {
    timerInterval = requestAnimationFrame(updateTimer);
  }
}

/**
 * Updates the time if needed and handles the game state
 * @param {number} timestamp - The current timestamp
 */
function updateTimeIfNeeded(timestamp) {
  if (timestamp - gameTime.lastUpdate >= 100) {
    gameTime.total++;
    updateTimeDisplay();
    gameTime.lastUpdate = timestamp;
  }
}

/**
 * Updates the time display and handles the game state
 */
function updateTimeDisplay() {
  const formattedTime = formatTime(gameTime.total);
  if (gameTime.container.innerHTML !== formattedTime) {
    gameTime.container.innerHTML = formattedTime;
    finalGameTime = formattedTime;
  }
}

/**
 * Formats the time into a string
 * @param {number} time - The time to format
 * @returns {string} The formatted time string
 */
function formatTime(time) {
  const minutes = Math.floor(time / 600);
  const seconds = Math.floor((time % 600) / 10);
  const tenths = (time % 10) * 10;

  return `${minutes}:${seconds.toString().padStart(2, "0")}:${tenths
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Stops the timer and returns the final game time
 * @returns {string} The final game time
 */
function stopTimer() {
  if (timerInterval) {
    cancelAnimationFrame(timerInterval);
    timerInterval = undefined;
  }
  return finalGameTime;
}

/**
 * Resets the keyboard input
 */
function resetKeyboard() {
  keyboard.UP = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.D = false;
}

/**
 * Initializes the keyboard listeners for the game
 */
function initializeKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (!keyboardActive) return;

    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 68) keyboard.D = true;
    if (e.keyCode == 83) keyboard.S = true;
  });

  window.addEventListener("keyup", (e) => {
    if (!keyboardActive) return;

    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 68) keyboard.D = false;
    if (e.keyCode == 83) keyboard.S = false;
  });
}

/**
 * Initializes the keyboard listeners for the game
 */
if (!keyboardActive) {
  initializeKeyboardListeners();
}

/**
 * Handles the game over state and resets the keyboard input
 */
document.addEventListener("gameOver", () => {
  resetKeyboard();
  keyboardActive = false;
});
