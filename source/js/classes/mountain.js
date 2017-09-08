class Mountain {
  constructor(foot, height, peaks, color, distance) {
    this.foot = foot;
    this.height = height;
    this.peaks = peaks;
    this.color = color;
    this.distance = distance;
  }

  draw(ctx, plx) {
    let plxf = 1;
    if (this.distance === 1) plxf = 0.25;
    if (this.distance === 2) plxf = 0.5;
    if (this.distance === 3) plxf = 0.8;
    if (this.distance === 4) plxf = 1;
    if (this.distance === 5) plxf = 1.5;
    let foot = this.foot + plx * plxf;

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
