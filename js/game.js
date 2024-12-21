let canvas;
let world;
let keyboardActive = true;
let keyboard = new Keyboard();
let musicOff = document.getElementById("pause");
let musicON = document.getElementById("play");
let soundOn = document.getElementById("soundOn");
let soundOff = document.getElementById("soundOff");
let playGameButton = document.getElementById("playGameButton");
let gameContainer = document.getElementById("game-container");
let controlsContainer = document.getElementById("controls-container");
let menuButton = document.getElementById("menu");
let soundsOn = false;
let musicOn = false;
let gameOverTimeout;

async function playGame() {
  prepareUIForGameStart();
  initializeWorld();

  try {
    await loadGameResources();
    finalizeGameStart();
  } catch (error) {
    console.error("Error loading game resources:", error);
  }
}

function prepareUIForGameStart() {
  let mainContainer = document.getElementsByTagName("main")[0];
  mainContainer.classList.remove("start-screen");

  let navButtons = document.getElementById("nav-controls");
  navButtons.classList.add("d-none");
  navButtons.classList.remove("nav-controls");

  let loadingText = document.getElementById("loadingText");
  loadingText.classList.remove("d-none");
  loadingText.classList.add("loading-text");

  gameContainer.innerHTML = "";
}

function initializeWorld() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
  }

  handleGameEndHTMLElements();
}

function handleGameEndHTMLElements() {
  world.setGameEndCallback((gameState) => {
    let audioControls = document.getElementById("audio-controls");
    audioControls.classList.add("d-none");
    audioControls.classList.remove("audio-controls");
    gameOverTimeout = setTimeout(() => {
      gameContainer.innerHTML = gameOverHTML(gameState);
    }, 4000);
  });
}

async function loadGameResources() {
  await Promise.all([
    initializeLevel1(),
    new Promise((resolve) => {
      world.sounds.initializeAudio();
      world.sounds.toggleGameSounds(true);
      resolve();
    }),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
}

function finalizeGameStart() {
  let loadingText = document.getElementById("loadingText");
  loadingText.classList.add("d-none");
  loadingText.classList.remove("loading-text");

  let audioControls = document.getElementById("audio-controls");
  audioControls.classList.remove("d-none");
  audioControls.classList.add("audio-controls");
  toggleSoundButtons(false);
  toggleMusicButtons(false);

  if (window.innerWidth < 1000) {
    console.log("Initialisiere Mobile Controls in finalizeGameStart");

    if (controlsContainer) {
      controlsContainer.classList.remove("d-none");
      controlsContainer.classList.add("controls-container");
      controlsContainer.innerHTML = responsiveControlsHTML();
    }
  }

  canvas.classList.remove("d-none");
  world.setLevel(level1);
  keyboardActive = true;
}

const controls = {
  left: () => {
    resetKeyboard();
    keyboard.LEFT = true;
  },
  right: () => {
    resetKeyboard();
    keyboard.RIGHT = true;
  },
  jump: () => {
    resetKeyboard();
    keyboard.UP = true;
  },
  throwBottle: () => {
    resetKeyboard();
    keyboard.D = true;
  },
};

function updateGameContainer(section) {
  let contentMap = {
    info: controlsHTML,
    credits: creditsHTML,
    play: playGameButtonHTML,
  };

  if (contentMap[section]) {
    gameContainer.innerHTML = contentMap[section]();
  }
}

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

function toggleMusicButtons(isMusicOff) {
  if (isMusicOff) {
    musicON.classList.add("d-none");
    musicON.classList.remove("button-style", "audio-button");
    musicOff.classList.remove("d-none");
    musicOff.classList.add("button-style", "audio-button");
  } else {
    musicON.classList.remove("d-none");
    musicON.classList.add("button-style", "audio-button");
    musicOff.classList.add("d-none");
    musicOff.classList.remove("button-style", "audio-button");
  }
}

function toggleSoundButtons(isSoundOff) {
  if (isSoundOff) {
    soundOn.classList.add("d-none");
    soundOn.classList.remove("button-style", "audio-button");
    soundOff.classList.remove("d-none");
    soundOff.classList.add("button-style", "audio-button");
  } else {
    soundOn.classList.remove("d-none");
    soundOn.classList.add("button-style", "audio-button");
    soundOff.classList.add("d-none");
    soundOff.classList.remove("button-style", "audio-button");
  }
}

function handleSoundToggle() {
  let isSoundButtonVisible = !soundOn.classList.contains("d-none");
  if (world && world.sounds) {
    world.sounds.toggleGameSounds(!isSoundButtonVisible);
    toggleSoundButtons(isSoundButtonVisible);
  }
}

function handleMusicToggle() {
  let isMusicOff = !musicON.classList.contains("d-none");
  if (world && world.sounds) {
    world.sounds.toggleMusic(!isMusicOff);
    toggleMusicButtons(isMusicOff);
  }
}

function openInGameMenu() {
  keyboardActive = false;
  world.pauseGame();

  // Speichere den aktuellen Zustand der Musik und Sounds
  soundsOn = !soundOff.classList.contains("d-none");
  musicOn = !musicOff.classList.contains("d-none");

  // Pause Sounds und Musik
  if (world && world.sounds) {
    world.sounds.toggleGameSounds(true); // Mute game sounds
    world.sounds.toggleMusic(true); // Pause background music
  }

  gameContainer.innerHTML = inGameMenuHTML();
}

function closeInGameMenu() {
  keyboardActive = true;
  resetKeyboard();
  world.resumeGame();

  if (world && world.sounds) {
    world.sounds.toggleGameSounds(!soundsOn);
    world.sounds.toggleMusic(!musicOn);
  }

  gameContainer.innerHTML = "";
}

function updateUIElements(uiElements) {
  canvas.classList.add("d-none");
  uiElements.nav.classList.add("nav-controls");
  uiElements.nav.classList.remove("d-none");
  uiElements.audio.classList.remove("audio-controls");
  uiElements.audio.classList.add("d-none");
  uiElements.main.classList.add("start-screen");
}

function backToMenu() {
  const uiElements = {
    main: document.getElementsByTagName("main")[0],
    nav: document.getElementById("nav-controls"),
    audio: document.getElementById("audio-controls"),
  };
  gameContainer.innerHTML = "";

  if (world) {
    world.pauseGame();
  }
  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
    gameOverTimeout = null;
  }

  updateUIElements(uiElements);
  gameContainer.innerHTML = playGameButtonHTML();
}

function resetKeyboard() {
  keyboard.UP = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.D = false;
}

function restartGame() {
  let audioControls = document.getElementById("audio-controls");
  gameContainer.innerHTML = "";
  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
    gameOverTimeout = null;
  }

  playGame();

  audioControls.classList.add("d-none");
  audioControls.classList.remove("audio-controls");
  canvas.classList.add("d-none");
}

function initializeAudioListeners() {
  soundOn.addEventListener("click", handleSoundToggle);
  soundOff.addEventListener("click", handleSoundToggle);
  musicON.addEventListener("click", handleMusicToggle);
  musicOff.addEventListener("click", handleMusicToggle);
  menuButton.addEventListener("click", openInGameMenu);
}

const sectionHandlers = {
  info: () => updateGameContainer("info"),
  play: () => updateGameContainer("play"),
  credits: () => {
    updateGameContainer("credits");
    updateCreditsContainer("legalNotice");
  },
  legalNotice: () => updateCreditsContainer("legalNotice"),
  privacyPolicy: () => updateCreditsContainer("privacyPolicy"),
};

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

function initializeKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (!keyboardActive) return;

    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 68) keyboard.D = true;
  });

  window.addEventListener("keyup", (e) => {
    if (!keyboardActive) return;

    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 68) keyboard.D = false;
  });
}

function initializePlayGameButton() {
  gameContainer.innerHTML = playGameButtonHTML();
}

initializeAudioListeners();
initializeNavigationListeners();
if (keyboardActive) {
  initializeKeyboardListeners();
}
document.addEventListener("DOMContentLoaded", () => {
  initializePlayGameButton();
});
document.addEventListener("gameOver", () => {
  resetKeyboard();
  keyboardActive = false;
});
