class Level {
    enemies;
    clouds;
    backgroundObject;
    collectableBottles;
    collectableCoins;
    level_end_x = 4000;

    constructor(enemies, clouds, backgroundObject, collectableBottles, collectableCoins){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObject = backgroundObject;
        this.collectableBottles = collectableBottles;
        this.collectableCoins = collectableCoins;
    }
}