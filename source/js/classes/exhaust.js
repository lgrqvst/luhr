class Exhaust {
  constructor(x,y,rotation,speed,type,size,intensity,color,opacity) {
    this.x = x;
    this.y = y;
    this.speed = speed * intensity / 100;
    this.rotation = rotation;
    this.type = type;
    this.size = size * intensity / 100;
    // this.intensity = intensity;
    this.color = color;
    this.opacity = opacity;
  }

  move() {
    if (this.x < 0 || this.x > VW || this.y > VH) {
      return true;
    }

    this.y += Math.sin(rads(this.rotation)) * this.speed;
    this.x += Math.cos(rads(this.rotation)) * this.speed;

    if (this.type === 'idle') {
      this.y -= globals.gravity * 10;
      this.x += globals.wind / 5;
    }

    return false;
  }

  fade() {
    if (this.type === 'primary') {
      this.opacity -= 0.03;
      this.size += Math.random() * 2;

    } else if (this.type === 'secondary') {
      this.color.g -= 5;
      this.color.b -= 10;
      this.opacity -= 0.03;
      this.size += Math.random() * 3;

    } else if (this.type === 'tertiary') {
      this.opacity -= 0.1;
      // this.size += Math.random();
      this.size += 0.2;

    } else if (this.type === 'idle') {
      this.opacity -= 0.03;
      this.size += Math.random() * 0.5;
    }

    if (this.opacity <= 0) {
      return true;
    }
    return false;
  }

  draw(ctx) {
    let pos = local2global(this);
    let p;

    if (this.type === 'primary') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      p = pos(this.size * 2, 0);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.lineWidth = this.size / 10;
      ctx.stroke();

    } else if (this.type === 'secondary') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      p = pos(this.size * 2, 0);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.lineWidth = this.size / 10;
      // ctx.lineWidth = 4;
      ctx.stroke();

    } else if (this.type === 'tertiary') {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      p = pos(this.size * 2, 0);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

    } else if (this.type === 'idle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.random() * this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
      ctx.fill();
    }

  }
}
