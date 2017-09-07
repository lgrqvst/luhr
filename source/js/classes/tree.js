class Tree {
  constructor(x,z,type,height,color) {
    this.x = x;
    this.z = z;
    this.type = type;
    this.color = color;
    this.height = type === 2 ? height * 1.5 : height;
    this.frame = 0;
    this.frameDirection = 'asc';
  }

  draw(ctx, plx) {
    let h = this.height / 10;

    let w = globals.wind;

    if (this.frameDirection === 'asc') {
      this.frame += Math.round(Math.random() * 3);
    } else {
      this.frame -= Math.round(Math.random() * 3);
    }

    if (this.frame >= 75) {
      this.frameDirection = 'desc';
    }

    if (this.frame <= 0) {
      this.frameDirection = 'asc';
    }

    let xmod = w * this.frame / 100;

    if (this.type === 1) {
      // Draw type 1 tree, the proud FIR

      ctx.beginPath();
      ctx.moveTo(this.x - h / 2, VH);
      ctx.lineTo(0.25 * xmod + (this.x - h / 2), VH - h * 1);
      ctx.lineTo(0.1 * xmod + (this.x - h * 4), VH - h / 4);

      ctx.lineTo(0.5 * xmod + (this.x - h), VH - h * 3);
      ctx.lineTo(0.6 * xmod + (this.x - h * 3), VH - h * 2.5);

      ctx.lineTo(0.7 * xmod + (this.x - h / 2), VH - h * 6);
      ctx.lineTo(0.8 * xmod + (this.x - h * 2), VH - h * 5);

      ctx.lineTo(1.25 * xmod + (this.x), VH - h * 10);

      ctx.lineTo(0.8 * xmod + (this.x + h * 2), VH - h * 5);
      ctx.lineTo(0.7 * xmod + (this.x + h / 2), VH - h * 6);

      ctx.lineTo(0.6 * xmod + (this.x + h * 3), VH - h * 2.5);
      ctx.lineTo(0.5 * xmod + (this.x + h), VH - h * 3);

      ctx.lineTo(0.1 * xmod + (this.x + h * 4), VH - h / 4);
      ctx.lineTo(0.25 * xmod + (this.x + h / 2), VH - h * 1);

      ctx.lineTo(this.x + h / 2, VH);

      ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
      ctx.fill();

    }

    if (this.type === 2) {
      // Draw type 2 tree, the mighty PINE
      // Actually, I think I'll just keep this kind of tree this way. Just a
      // trunk going straight up. It adds an interesting visual element to the
      // landscape.

      ctx.beginPath();
      ctx.moveTo(this.x - h * 0.5, VH);
      ctx.lineTo(0.25 * xmod + (this.x - h * 0.25), VH - h * 12);
      ctx.lineTo(0.25 * xmod + (this.x + h * 0.25), VH - h * 12);
      ctx.lineTo(this.x + h * 0.5, VH);

      ctx.fillStyle = `rgba(${this.color.r + 50},${this.color.g + 10},${this.color.b + 10},1)`;
      ctx.fill();
    }
  }
}
