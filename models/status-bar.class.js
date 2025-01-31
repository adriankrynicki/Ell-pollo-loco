class StatusBar extends DrawableObject {
    percentage = 100;

    constructor() {
        super();
        this.width = 200;
        this.height = 50;
    }

    resolveImage() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 79) {
            return 4;
        } else if (this.percentage > 59) {
            return 3;
        } else if (this.percentage > 39) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}