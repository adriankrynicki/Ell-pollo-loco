class DrawableObject {
    x;
    y;
    img;
    width;
    height;
    imageCach = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        return Promise.all(arr.map(path => {
            return new Promise((resolve) => {
                if (this.imageCach[path]) {
                    resolve();
                    return;
                }
                let img = new Image();
                img.onload = () => resolve();
                img.src = path;
                this.imageCach[path] = img;
            });
        }));
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

}