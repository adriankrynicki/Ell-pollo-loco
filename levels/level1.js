/** @type {Level} Global variable to store the current level instance */
let level1;

/** Array of enemy and spawn coordinates
 * @type {Array<{type: string, spawnX: number}>}
 */
let enemySpawnPoints = [
  { type: "Chicken", spawnX: 1000 },
  { type: "Chicken", spawnX: 1400 },
  { type: "Chicken", spawnX: 1500 },
  { type: "Chicken", spawnX: 2200 },
  { type: "Chicken", spawnX: 2300 },
  { type: "Chicken", spawnX: 2400 },
  { type: "Chicken", spawnX: 3000 },
  { type: "Chicken", spawnX: 3300 },
  { type: "Chicken", spawnX: 3400 },
  { type: "Chicken", spawnX: 3500 },
  { type: "Chicken", spawnX: 4000 },
  { type: "Chicken", spawnX: 4100 },
  { type: "Chicken", spawnX: 4300 },
  { type: "Chicken", spawnX: 4700 },
  { type: "Chicken", spawnX: 4800 },
  { type: "Chicken", spawnX: 5000 },
  { type: "Chicken", spawnX: 5500 },
  { type: "Chicken", spawnX: 5600 },
  { type: "Chicken", spawnX: 5700 },
  { type: "Chicken", spawnX: 5800 },
  { type: "Chicken", spawnX: 6500 },
  { type: "Chicken", spawnX: 6600 },
  { type: "Chicken", spawnX: 6700 },
  { type: "Chicken", spawnX: 6800 },
  { type: "Chicken", spawnX: 6900 },
  { type: "Chicken", spawnX: 8000 },
  { type: "Chicken", spawnX: 8100 },
  { type: "Chicken", spawnX: 8200 },
  { type: "Chicken", spawnX: 8300 },
  { type: "Chicken", spawnX: 8400 },
  { type: "Chicken", spawnX: 8500 },
  { type: "Chicken", spawnX: 8600 },
  { type: "Chicken", spawnX: 9700 },
  { type: "Chicken", spawnX: 9800 },
  { type: "Chicken", spawnX: 9900 },
  { type: "Chicken", spawnX: 10000 },
  { type: "Chicken", spawnX: 10100 },
  { type: "Chicken", spawnX: 11000 },
  { type: "Chicken", spawnX: 11100 },
  { type: "Chicken", spawnX: 11200 },
  { type: "Chicken", spawnX: 11300 },
  { type: "Chicken", spawnX: 11400 },
  { type: "Chicken", spawnX: 11500 },
  { type: "Chicken", spawnX: 12500 },
  { type: "Chicken", spawnX: 12600 },
  { type: "Chicken", spawnX: 12700 },
  { type: "Chicken", spawnX: 12800 },
  { type: "Chicken", spawnX: 12900 },
  { type: "Chicken", spawnX: 13900 },
  { type: "Chicken", spawnX: 14000 },
  { type: "Chicken", spawnX: 14100 },
  { type: "Chicken", spawnX: 14200 },
  { type: "Chicken", spawnX: 14300 },
  { type: "Chicken", spawnX: 15300 },
  { type: "Chicken", spawnX: 15400 },
  { type: "Chicken", spawnX: 15500 },
  { type: "Chicken", spawnX: 15600 },
  { type: "Chicken", spawnX: 15700 },
  { type: "Chicken", spawnX: 15800 },
  { type: "Chicken", spawnX: 15900 },
  { type: "Chicken", spawnX: 16500 },
  { type: "Chicken", spawnX: 16600 },
  { type: "Chicken", spawnX: 16700 },
  { type: "Chicken", spawnX: 16800 },
  { type: "Chicken", spawnX: 16900 },
  { type: "Chicken", spawnX: 17100 },
  { type: "Chicken", spawnX: 17200 },
  { type: "Chicken", spawnX: 17300 },
  { type: "Chicken", spawnX: 18400 },
  { type: "Chicken", spawnX: 18500 },
  { type: "Chicken", spawnX: 18600 },
  { type: "Chicken", spawnX: 18700 },
  { type: "Chicken", spawnX: 18800 },
  { type: "Chicken", spawnX: 18900 },
  { type: "Chicken", spawnX: 19000 },

  { type: "SmallChicken", spawnX: 1400 },
  { type: "SmallChicken", spawnX: 2100 },
  { type: "SmallChicken", spawnX: 2300 },
  { type: "SmallChicken", spawnX: 2500 },
  { type: "SmallChicken", spawnX: 2700 },
  { type: "SmallChicken", spawnX: 2900 },
  { type: "SmallChicken", spawnX: 3100 },
  { type: "SmallChicken", spawnX: 3500 },
  { type: "SmallChicken", spawnX: 4100 },
  { type: "SmallChicken", spawnX: 4300 },
  { type: "SmallChicken", spawnX: 4400 },
  { type: "SmallChicken", spawnX: 4900 },
  { type: "SmallChicken", spawnX: 5200 },
  { type: "SmallChicken", spawnX: 5500 },
  { type: "SmallChicken", spawnX: 5600 },
  { type: "SmallChicken", spawnX: 6600 },
  { type: "SmallChicken", spawnX: 6700 },
  { type: "SmallChicken", spawnX: 6800 },
  { type: "SmallChicken", spawnX: 7300 },
  { type: "SmallChicken", spawnX: 7350 },
  { type: "SmallChicken", spawnX: 7400 },
  { type: "SmallChicken", spawnX: 7450 },
  { type: "SmallChicken", spawnX: 7500 },
  { type: "SmallChicken", spawnX: 7600 },
  { type: "SmallChicken", spawnX: 8000 },
  { type: "SmallChicken", spawnX: 8200 },
  { type: "SmallChicken", spawnX: 8400 },
  { type: "SmallChicken", spawnX: 8600 },
  { type: "SmallChicken", spawnX: 9000 },
  { type: "SmallChicken", spawnX: 9400 },
  { type: "SmallChicken", spawnX: 9600 },
  { type: "SmallChicken", spawnX: 9800 },
  { type: "SmallChicken", spawnX: 9900 },
  { type: "SmallChicken", spawnX: 10500 },
  { type: "SmallChicken", spawnX: 10600 },
  { type: "SmallChicken", spawnX: 10700 },
  { type: "SmallChicken", spawnX: 10800 },
  { type: "SmallChicken", spawnX: 10900 },
  { type: "SmallChicken", spawnX: 11750 },
  { type: "SmallChicken", spawnX: 11800 },
  { type: "SmallChicken", spawnX: 11850 },
  { type: "SmallChicken", spawnX: 11900 },
  { type: "SmallChicken", spawnX: 11950 },
  { type: "SmallChicken", spawnX: 12000 },
  { type: "SmallChicken", spawnX: 13600 },
  { type: "SmallChicken", spawnX: 13650 },
  { type: "SmallChicken", spawnX: 13700 },
  { type: "SmallChicken", spawnX: 13800 },
  { type: "SmallChicken", spawnX: 13900 },
  { type: "SmallChicken", spawnX: 14000 },
  { type: "SmallChicken", spawnX: 15200 },
  { type: "SmallChicken", spawnX: 15300 },
  { type: "SmallChicken", spawnX: 15400 },
  { type: "SmallChicken", spawnX: 15500 },
  { type: "SmallChicken", spawnX: 15600 },
  { type: "SmallChicken", spawnX: 16000 },
  { type: "SmallChicken", spawnX: 16750 },
  { type: "SmallChicken", spawnX: 16800 },
  { type: "SmallChicken", spawnX: 16850 },
  { type: "SmallChicken", spawnX: 16900 },
  { type: "SmallChicken", spawnX: 17000 },
  { type: "SmallChicken", spawnX: 18200 },
  { type: "SmallChicken", spawnX: 18150 },
  { type: "SmallChicken", spawnX: 18100 },
  { type: "SmallChicken", spawnX: 18050 },
  { type: "SmallChicken", spawnX: 18000 },
  { type: "SmallChicken", spawnX: 19050 },
  { type: "SmallChicken", spawnX: 19200 },
  { type: "SmallChicken", spawnX: 19300 },
  { type: "SmallChicken", spawnX: 19400 },
  { type: "SmallChicken", spawnX: 19500 },
];

/**
 * Initializes the level 1 and creates game objects
 * @param {Object} services - The services object containing game services
 * @returns {Level} The initialized level 1 instance
 */
function initializeLevel1(services) {
  level1 = new Level(
    createEnemies(services),
    createClouds(services),
    createBackgroundObjects(),
    [
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        1
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        2
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        3
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        4
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        5
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        6
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        7
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        8
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        9
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        10
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        11
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        12
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        13
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        14
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        15
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        16
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        17
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        18
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        19
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        20
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        21
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        22
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        23
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        24
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        25
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        26
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        27
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        28
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        29
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        30
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        31
      ),
      new CollectableBottles(
        "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
        32
      ),
    ],
    [
      new CollectableCoin("img/8_coin/coin_2.png", 400, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 450, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 500, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 550, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 525, 275),
      new CollectableCoin("img/8_coin/coin_2.png", 525, 225),
      new CollectableCoin("img/8_coin/coin_2.png", 500, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 500, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 1000, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 2000, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 3000, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 3500, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 3950, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 3975, 210),
      new CollectableCoin("img/8_coin/coin_2.png", 4000, 215),
      new CollectableCoin("img/8_coin/coin_2.png", 4025, 210),
      new CollectableCoin("img/8_coin/coin_2.png", 4050, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 3975, 125),
      new CollectableCoin("img/8_coin/coin_2.png", 4025, 125),
      new CollectableCoin("img/8_coin/coin_2.png", 5000, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 5000, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 5000, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 5000, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 5000, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 6050, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 6100, 175),
      new CollectableCoin("img/8_coin/coin_2.png", 6150, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 7200, 105),
      new CollectableCoin("img/8_coin/coin_2.png", 8050, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 9000, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 9850, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 9900, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 9950, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 10000, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 9975, 275),
      new CollectableCoin("img/8_coin/coin_2.png", 9975, 225),
      new CollectableCoin("img/8_coin/coin_2.png", 9950, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 9950, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 11100, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 12000, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 12700, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 13000, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 13500, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 13750, 275),
      new CollectableCoin("img/8_coin/coin_2.png", 14900, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 15000, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 15100, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 15200, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 15300, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 15400, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 15500, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 16500, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 17500, 150),
      new CollectableCoin("img/8_coin/coin_2.png", 18500, 275),
      new CollectableCoin("img/8_coin/coin_2.png", 19000, 100),
    ]
  );
}

/**
 * Creates enemies for the level
 * @param {Object} services - The services object containing game services
 * @returns {Array<Enemy>} The array of enemies created for the level
 */
function createEnemies(services) {
  let enemies = [];

  enemySpawnPoints.forEach((spawn, index) => {
    if (spawn.type === "Chicken") {
      enemies.push(new Chicken(index, spawn.spawnX, services));
    } else if (spawn.type === "SmallChicken") {
      enemies.push(new SmallChicken(index, spawn.spawnX, services));
    }
  });

  enemies.push(new Endboss(99, services));

  return enemies;
}

/**
 * Creates background objects for the level
 * @returns {Array<BackgroundObject>} The array of background objects created for the level
 */
function createBackgroundObjects() {
  let backgroundObjects = [];

  for (let i = 0; i < 30; i++) {
    const x = calculateBackgroundPosition(i);
    const imageType = getImageType(i);

    backgroundObjects.push(
      new BackgroundObject(`img/5_background/layers/air.png`, x),
      new BackgroundObject(
        `img/5_background/layers/3_third_layer/${imageType}.png`,
        x
      ),
      new BackgroundObject(
        `img/5_background/layers/2_second_layer/${imageType}.png`,
        x
      ),
      new BackgroundObject(
        `img/5_background/layers/1_first_layer/${imageType}.png`,
        x
      )
    );
  }
  return backgroundObjects;
}

/**
 * Creates clouds for the level
 * @param {Object} services - The services object containing game services
 * @returns {Array<Clouds>} The array of clouds created for the level
 */
function createClouds(services) {
  let clouds = [];

  for (let i = 0; i < 30; i++) {
    const x = calculateBackgroundPosition(i);
    const imageType = getImageType(i);
    clouds.push(new Clouds(x, imageType, services));
  }
  return clouds;
}

/**
 * Calculates the background position based on the block index
 * @param {number} blockIndex - The index of the block
 * @returns {number} The calculated background position
 */
function calculateBackgroundPosition(blockIndex) {
  return blockIndex * 719 - 719;
}

/**
 * Determines the image type based on the block index
 * @param {number} blockIndex - The index of the block
 * @returns {string} The image type ("1" or "2")
 */
function getImageType(blockIndex) {
  return blockIndex % 2 === 0 ? "1" : "2";
}
