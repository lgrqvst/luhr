class Moon {
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.targetX = VW - x;
    this.targetY = -r;
    this.r = r;
  }

  move() {
    let dx = (this.targetX - this.x) / 50000;
    let dy = (this.targetY - this.y) / 50000;
    this.x += dx;
    this.y += dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245,235,255,1)';
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath()
    ctx.arc(this.x + this.r * 0.2, this.y, this.r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}
