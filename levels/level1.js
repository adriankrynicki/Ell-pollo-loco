let level1;

function initializeLevel1() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    [
      new CollectableBottles("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1),
      new CollectableBottles("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 2),
      new CollectableBottles("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 3),
      new CollectableBottles("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 4),
      new CollectableBottles("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 5),
      new CollectableBottles("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 6),
      new CollectableBottles("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 7),
      new CollectableBottles("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 8),
      new CollectableBottles("img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 9),
      new CollectableBottles("img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 10),
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
    ]
  );
}

function createEnemies() {
  let enemies = [];
  
  for (let i = 1; i <= 15; i++) {
      enemies.push(new Chicken(i));
  }
  
  for (let i = 1; i <= 15; i++) {
      enemies.push(new SmallChicken(i));
  }
  
  enemies.push(new Endboss(99));
  
  return enemies;
}

function calculateBackgroundPosition(blockIndex) {
    return blockIndex * 719 - 719;
}

function getImageType(blockIndex) {
  return blockIndex % 2 === 0 ? '1' : '2';
}

function createBackgroundObjects() {
    let backgroundObjects = [];
    
    for (let i = 0; i < 10; i++) {
        const x = calculateBackgroundPosition(i);
        const imageType = getImageType(i);
        
        backgroundObjects.push(
            new BackgroundObject(`img/5_background/layers/air.png`, x),
            new BackgroundObject(`img/5_background/layers/3_third_layer/${imageType}.png`, x),
            new BackgroundObject(`img/5_background/layers/2_second_layer/${imageType}.png`, x),
            new BackgroundObject(`img/5_background/layers/1_first_layer/${imageType}.png`, x)
        );
    }
    return backgroundObjects;
}

function createClouds() {
    let clouds = [];
    
    for (let i = 0; i < 10; i++) {
        const x = calculateBackgroundPosition(i);
        const imageType = getImageType(i);
        clouds.push(new Clouds(x, imageType));
    }
    return clouds;
}
