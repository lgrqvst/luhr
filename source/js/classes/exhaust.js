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
      // return true;
    }

    this.y += Math.sin(rads(this.rotation)) * this.speed;
    this.x += Math.cos(rads(this.rotation)) * this.speed;

    if (this.type === 'generator') {
      this.y -= globals.gravity * 2;
      this.x += globals.wind / 20;
    }

    return false;
  }

  fade() {
    switch (this.type) {
      case 'generator':
        this.size += 0.1;
        this.opacity -= 0.015;
      break;
      case 'venting':
        this.opacity -= 0.1;
      break;
      case 'propellant1':

      break;
      case 'propellant2':

      break;
      case 'condensate':

      break;
      case 'rotation':

      break;
    }

    if (this.opacity <= 0) {
      return true;
    }
    return false;
  }

  draw(ctx) {
    let pos = local2global(this);
    let p;

    switch (this.type) {
      case 'generator':
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.random() * this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        ctx.fill();
      break;
      case 'venting':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(this.size * 3, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        ctx.lineWidth = this.size;
        // ctx.lineWidth = 4;
        ctx.stroke();
      break;
      case 'propellant1':

      break;
      case 'propellant2':

      break;
      case 'condensate':

      break;
      case 'rotation':

      break;
    }

  }
}
