let canvas;
let world;
let keyboard = new Keyboard();
let pauseMusicButton = document.getElementById("pause");
let playMusicButton = document.getElementById("play");
let soundOn = document.getElementById("soundOn");
let soundOff = document.getElementById("soundOff");
let playGameButton = document.getElementById("playGameButton");
let gameContainer = document.getElementById("game-container");

async function playGame() {
  prepareUIForGameStart();
  initializeWorld();

  try {
    await loadGameResources();
    finalizeGameStart();
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  }
}

function prepareUIForGameStart() {
  const mainElement = document.getElementsByTagName("main")[0];
  mainElement.classList.remove("start-screen");
  mainElement.classList.add("loading-screen");

  const loadingGif = document.getElementById("loadingGif");
  loadingGif.classList.remove("d-none");

  const audioControls = document.getElementById("audio-controls");
  audioControls.classList.remove("d-none");
  audioControls.classList.add("audio-controls");

  const navButtons = document.getElementById("nav-controls");
  navButtons.classList.add("d-none");
  navButtons.classList.remove("nav-controls");
}

function initializeWorld() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
  const mainElement = document.getElementsByTagName("main")[0];
  mainElement.classList.remove("loading-screen");
  
  const loadingGif = document.getElementById("loadingGif");
  loadingGif.classList.add("d-none");
  
  canvas.classList.remove("d-none");
  playGameButton.classList.add("d-none");
  world.setLevel(level1);
}

function updateGameContainer(section) {
  const contentMap = {
    info: controlsHTML,
    play: playGameButtonHTML,
    credits: creditsHTML,
  };

  if (contentMap[section]) {
    gameContainer.innerHTML = contentMap[section]();
  }
}

function updateCreditsContainer(section) {
  const contentMap = {
    privacyPolicy: privacyPolicyHTML,
    legalNotice: legalNoticeHTML,
  };

  if (contentMap[section]) {
    let creditsContent = document.getElementById("credits-content");
    if (creditsContent) {
      creditsContent.innerHTML = contentMap[section]();
    } else {
      console.error("credits-content Element nicht gefunden");
    }
  }
}

function toggleMusicButtons(isMusicOff) {
  if (isMusicOff) {
    playMusicButton.classList.add("d-none");
    playMusicButton.classList.remove("button-style", "audio-button");
    pauseMusicButton.classList.remove("d-none");
    pauseMusicButton.classList.add("button-style", "audio-button");
  } else {
    playMusicButton.classList.remove("d-none");
    playMusicButton.classList.add("button-style", "audio-button");
    pauseMusicButton.classList.add("d-none");
    pauseMusicButton.classList.remove("button-style", "audio-button");
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
  const isSoundButtonVisible = !soundOn.classList.contains("d-none");
  if (world && world.sounds) {
    world.sounds.toggleGameSounds(!isSoundButtonVisible);
    toggleSoundButtons(isSoundButtonVisible);
  }
}

function handleMusicToggle() {
  const isMusicOff = !playMusicButton.classList.contains("d-none");
  if (world && world.sounds) {
    world.sounds.toggleMusic(!isMusicOff);
    toggleMusicButtons(isMusicOff);
  }
}

function initializeAudioListeners() {
  soundOn.addEventListener("click", handleSoundToggle);
  soundOff.addEventListener("click", handleSoundToggle);
  playMusicButton.addEventListener("click", handleMusicToggle);
  pauseMusicButton.addEventListener("click", handleMusicToggle);
}

function initializeNavigationListeners() {
  document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-section]");
    if (!button) return;

    const section = button.dataset.section;

    if (section === "legalNotice" || section === "privacyPolicy") {
      let creditsContent = document.getElementById("credits-content");
      if (creditsContent) {
        updateCreditsContainer(section);
      } else {
        console.error("credits-content Element nicht gefunden");
      }
    } else {
      updateGameContainer(section);
    }
  });
}

function initializeKeyboardListeners() {
  window.addEventListener("keydown", (e) => {
    if (e.keyCode == 38) keyboard.UP = true;
    if (e.keyCode == 37) keyboard.LEFT = true;
    if (e.keyCode == 39) keyboard.RIGHT = true;
    if (e.keyCode == 40) keyboard.DOWN = true;
    if (e.keyCode == 68) keyboard.D = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.keyCode == 38) keyboard.UP = false;
    if (e.keyCode == 37) keyboard.LEFT = false;
    if (e.keyCode == 39) keyboard.RIGHT = false;
    if (e.keyCode == 40) keyboard.DOWN = false;
    if (e.keyCode == 68) keyboard.D = false;
  });
}

function initializeGameListeners() {
    if (playGameButton) {
        playGameButton.addEventListener('click', playGame);
    }
}

initializeAudioListeners();
initializeNavigationListeners();
initializeKeyboardListeners();
document.addEventListener('DOMContentLoaded', () => {
    initializeGameListeners();
});
