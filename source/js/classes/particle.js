class Particle {
  constructor() {
    this.x = Math.round(Math.random() * w);
    this.y = Math.round(Math.random() * h);

    this.energy = Math.round(Math.random() * 1000);

    this.radiusFactor = 100;
    this.targetRadiusFactor = this.radiusFactor + (25 - Math.round(Math.random() * 50));

    this.color = {
      r: Math.round(Math.random() * 50 + 200),
      g: Math.round(Math.random() * 50 + 200),
      b: Math.round(Math.random() * 50 + 200)
    }
    this.opacity = Math.round(Math.random() * 30 + 20) / 100;
    // this.targetOpacity = this.opacity + ((50 - Math.round(Math.random() * 100)) / 100);
    this.targetOpacity = Math.round(Math.random() * 40 + 10) / 100;

    this.driftDistance = 25;
    this.targetX = this.x + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
    this.targetY = this.y + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
  }

  draw() {
    let color = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.energy / this.radiusFactor, 0, Math.PI * 2);
    ctx.fill();
  }

  drift() {
    let x = (this.targetX - this.x) / (Math.round(Math.random() * 400) + 100);
    let y = (this.targetY - this.y) / (Math.round(Math.random() * 400) + 100);
    this.x += x;
    this.y += y;
    if (this.x > w + this.energy / this.radiusFactor) this.x = 0;
    if (this.x < 0 - this.energy / this.radiusFactor) this.x = w;
    if (this.y > h + this.energy / this.radiusFactor) this.y = 0;
    if (this.y < 0 - this.energy / this.radiusFactor) this.y = h;
    if (Math.abs(this.targetX - this.x) < 10 || Math.abs(this.targetX - this.x) > 100) this.targetX = this.x + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
    if (Math.abs(this.targetY - this.y) < 10 || Math.abs(this.targetY - this.y) > 100) this.targetY = this.y + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
  }

  pulsate() {
    let r = (this.targetRadiusFactor - this.radiusFactor) / 70;
    this.radiusFactor += r;

    if (this.radiusFactor < 75) this.targetRadiusFactor += 50;
    if (this.radiusFactor > 125) this.targetRadiusFactor -= 50;

    if (Math.abs(this.targetRadiusFactor - this.radiusFactor) < 10) this.targetRadiusFactor = this.radiusFactor + (25 - Math.round(Math.random() * 50));
  }

  flicker() {
    let o = (this.targetOpacity - this.opacity) / 50;
    this.opacity += o;

    // if (this.opacity < 0.1) this.targetOpacity += 0.5;
    // if (this.opacity > 0.9) this.targetOpacity -= 0.5;

    // if (Math.abs(this.targetOpacity - this.opacity) < 10) this.targetOpacity = this.opacity + ((50 - Math.round(Math.random() * 100)) / 100);
    if (Math.abs(this.targetOpacity - this.opacity) < 10) this.targetOpacity = Math.round(Math.random() * 40 + 10) / 100;

  }

  deplete() {
    
  }
}
