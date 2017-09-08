class Exhaust {
  constructor(x,y,rotation,speed,type,size,color,opacity) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.rotation = rotation;
    this.type = type;
    this.size = size;
    this.color = color;
    this.opacity = opacity;
  }

  move() {
    if (this.x < 0 || this.x > VW || this.y < 0 || this.y > VH) {
      return true;
    }

    this.y += Math.sin(rads(this.rotation)) * this.speed;
    this.x += Math.cos(rads(this.rotation)) * this.speed;

    if (this.type === 'smoke') {
      this.y -= globals.gravity * 5;
      this.x += globals.wind / 10;
    }

    return false;
  }

  fade() {
    if (this.type === 'line') {
      this.opacity -= 0.03;
      this.size += Math.random() * 2;
    } else if (this.type === 'smoke') {
      this.opacity -= 0.03;
      this.size += Math.random() * 0.5;
    } else if (this.type === 'quick') {
      this.opacity -= 0.1;
      this.size += Math.random();
    }
    if (this.opacity <= 0) {
      return true;
    }
    return false;
  }

  draw(ctx) {
    let pos = local2global(this);
    let p;

    if (this.type === 'line' || this.type === 'quick') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      p = pos(this.size * 2, 0);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.lineWidth = this.size / 5;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.type === 'smoke') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.random() * this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.fill();
    }

  }
}
