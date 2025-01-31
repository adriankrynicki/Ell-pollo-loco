class DrawableObject {
  x;
  y;
  img;
  width;
  height;
  imageCach = {};
  currentImage = 0;

  /**
   * Lädt ein einzelnes Bild
   * @param {string} path - Pfad zum Bild
   * @returns {Promise} Promise, das nach dem Laden des Bildes resolved wird
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    return new Promise((resolve) => {
      this.img.onload = () => resolve();
    });
  }

  /**
   * Lädt mehrere Bilder und speichert sie im Cache
   * @param {string[]} arr - Array von Bildpfaden
   * @returns {Promise} Promise, das nach dem Laden aller Bilder resolved wird
   */
  loadImages(arr) {
    return Promise.all(
      arr.map((path) => {
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
      })
    );
  }

  /**
   * Zeichnet das Objekt auf den Canvas
   * @param {CanvasRenderingContext2D} ctx - Der Canvas-Kontext
   */
  draw(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Fügt ein Array von Objekten zur Map hinzu
   * @param {DrawableObject[]} objects - Array von zeichenbaren Objekten
   */
  addObjectToMap(objects) {
    if (Array.isArray(objects)) {
      objects.forEach((obj) => this.addToMap(obj));
    }
  }

  /**
   * Fügt ein einzelnes Objekt zur Map hinzu
   * @param {DrawableObject} mo - Das zu zeichnende Objekt
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Spiegelt das Bild horizontal
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt die ursprüngliche Ausrichtung des Bildes wieder her
   * @param {DrawableObject} mo - Das zurückzuspiegelnde Objekt
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
