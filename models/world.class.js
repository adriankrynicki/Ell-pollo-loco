class World {
  // Basis-Properties
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  level;

  // Services-Deklaration
  services;

  // Spiel-Objekte Deklaration
  character;
  renderManager;

  // Spiel-Status Deklaration mit Default-Werten
  gameState = {
    gamePaused: false,
    gameWon: false,
    gameLost: false,
    gameStateHandled: false,
    endbossBarActivated: false,
  };

  constructor(canvas, keyboard) {
    // Basis-Properties
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    // Erstelle alle benötigten Objekte
    this.createBaseServices();
    this.createGameObjects();
    this.createManagerObjects();
  }

  createBaseServices() {
    this.services = {
      canvas: this.canvas,
      ctx: this.ctx,
      keyboard: this.keyboard,
      world: this,
      sounds: new Sounds(false),
    };

    const animationManager = AnimationManager.getInstance();
    animationManager.setServices(this.services);
    this.services.animationManager = animationManager;
  }

  createGameObjects() {
    this.services.character = new Character(this.services);

    // Status Bars erstellen
    this.statusBars = {
      character: new CharacterHPBar(),
      bottle: new BottleStatusBar(),
      coin: new CoinStatusBar(),
    };
    this.services.statusBars = this.statusBars;
    this.services.endbossHpBar = new EndbossHpBar();
  }

  createManagerObjects() {
    this.services.screenManager = new ScreenManager(this.services);
    this.services.renderManager = new RenderManager(this.services);
    this.services.collisionHandler = new CollisionHandler(this.services);
    this.services.bottleThrowManager = new BottleThrowManager(this.services);
    this.services.collectablesObjects = new CollectablesObjects(this.services);
    this.services.gameStateManager = new GameStateManager(this.services);
  }

  setLevel() {
    if (this.services.animationManager) {
      this.services.animationManager.reset();
    }

    this.services.animationManager = AnimationManager.getInstance();

    this.level = level1;
    this.services.level = level1;

    if (this.level) {
      this.services.renderManager.initialize(this.level);
      this.services.collisionHandler.initialize(this.level);
      this.services.collectablesObjects.initialize(this.level);
      this.services.gameStateManager.initialize(this.level);
      this.services.character.initialize(this.level);
      // Animationen starten
      this.startGameLoop();
    }
  }

  pauseGame() {
    this.gameState.gamePaused = true;
  }

  resumeGame() {
    this.gameState.gamePaused = false;
  }

  resetGame() {
    this.services.animationManager.reset();
  }

  startGameLoop() {
    if (this.gameState.gamePaused) {
      this.services.animationManager.pause();
    } else {
      this.services.animationManager.resume();
    }
  }
}
