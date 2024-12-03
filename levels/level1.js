let level1;

function initializeLevel1() {
  level1 = new Level(
    [
      new Chicken(1),
      new Chicken(2),
      new Chicken(3),
      new Chicken(4),
      new Chicken(5),
      new Chicken(6),
      new Chicken(7),
      new Chicken(8),
      new Chicken(9),
      new Chicken(10),
      new SmallChicken(1),
      new SmallChicken(2),
      new SmallChicken(3),
      new SmallChicken(4),
      new SmallChicken(5),
      new SmallChicken(6),
      new SmallChicken(7),
      new SmallChicken(8),
      new SmallChicken(9),
      new SmallChicken(10),
      new Endboss(),
    ],
    [new Clouds()],
    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -719
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        719 * 2
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        719 * 2
      ),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        719 * 3
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        719 * 3
      ),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        719 * 4
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        719 * 4
      ),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        719 * 5
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        719 * 5
      ),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 6),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        719 * 6
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        719 * 6
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        719 * 6
      ),
    ],
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
    ],
    [
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 350, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 400, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 450, 100),
      new CollectableCoin("img/8_coin/coin_2.png", 500, 200),
      new CollectableCoin("img/8_coin/coin_2.png", 550, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 1200, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 1500, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 1700, 250),
      new CollectableCoin("img/8_coin/coin_2.png", 2000, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 2200, 300),
      new CollectableCoin("img/8_coin/coin_2.png", 2500, 300),
    ]
  );
}
