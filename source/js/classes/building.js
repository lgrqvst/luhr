class Building {
  constructor(x, type, height, color) {
    this.x = x;
    this.type = type;
    this.height = height;
    this.color = color;
  }

  draw(ctx, plx) {
    let x = this.x + plx * 1.3;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
    ctx.fillRect(x, VH - this.height, 50, this.height);
  }
}
