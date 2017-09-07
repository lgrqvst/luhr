class Mountain {
  constructor(foot, height, peaks, color, distance) {
    this.foot = foot;
    this.height = height;
    this.peaks = peaks;
    this.color = color;
    this.distance = distance;
  }

  draw(ctx, plx) {
    let foot = this.foot + plx * (1 + this.distance / 3);

    ctx.beginPath();
    ctx.moveTo(foot, VH);

    ctx.bezierCurveTo(
      foot + VW / 9,
      VH - (VH * this.height / 100 / 4),
      foot + VW / 4.5,
      VH - (VH * this.height / 100 / 4 * 2),
      foot + VW / 3,
      VH - VH * this.height / 100
    );

    let base = foot + VW / 3;

    if (this.peaks > 1) {
      for (let i = 0; i < this.peaks; ++i) {
        ctx.bezierCurveTo(
          base + VW / 15,
          VH - (VH * this.height / 100 / 3 * 2),
          base + VW / 7.5,
          VH - (VH * this.height / 100 / 3 * 2),
          base + VW / 5,
          VH - VH * this.height / 100
        )
        base += VW / 5;
      }
    }

    ctx.bezierCurveTo(
      base + VW / 9,
      VH - (VH * this.height / 100 / 4 * 2),
      base + VW / 4.5,
      VH - (VH * this.height / 100 / 4),
      base + VW / 3,
      VH,
    )

    ctx.lineTo(this.foot, VH);

    ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`;
    ctx.fill();
  }

}
