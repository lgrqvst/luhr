class Exhaust {
  constructor(x,y,rotation,speed,type,size,intensity,color,opacity) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(rads(rotation)) * speed;
    this.vy = Math.sin(rads(rotation)) * speed;
    this.speed = speed;
    this.rotation = rotation;
    this.type = type;
    this.size = size;
    this.intensity = intensity;
    this.color = color;
    this.opacity = opacity;
  }

  move() {
    if (this.x < 0 || this.x > VW || this.y > VH) {
      // return true;
    }

    switch (this.type) {
      case 'generator':
        this.x += this.vx * this.intensity / 50;
        this.y += this.vy * this.intensity / 50;
        this.x += globals.wind / 20;
        this.y -= globals.gravity * 2;
      break;
      case 'propellant2':
        this.vy += globals.gravity;
        this.vx *= globals.drag;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.vy > VH) {
          this.y = VH;
          this.vy *= -0.35;
          this.vx *= 0.35;
        }

        if (landingpads[0].apparentX - 40 < this.x && this.x < landingpads[0].apparentX + 40 && this.y + this.vy > VH - 162 && this.y <= VH - 162) {
          // Maybe rotate to face up and set state to landed?
          this.y = VH - 162;
          this.vy *= -0.2;
          this.vx *= 0.5;
        }
      break;
      case 'condensate':
        this.vy += globals.gravity;
        this.vx *= globals.drag;
        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.vy > VH) {
          this.y = VH;
          this.vy *= 0;
          this.vx *= 0;
        }

        if (landingpads[0].apparentX - 40 < this.x && this.x < landingpads[0].apparentX + 40 && this.y + this.vy > VH - 162 && this.y <= VH - 162) {
          // Maybe rotate to face up and set state to landed?
          this.y = VH - 162;
          this.vy *= 0;
          this.vx *= 0.5;
        }
      break;
      default:
        this.y += Math.sin(rads(this.rotation)) * this.speed;
        this.x += Math.cos(rads(this.rotation)) * this.speed;
    }



    if (this.type === 'generator') {

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
        this.opacity -= 0.04;

        this.size *= (1 + Math.random() * 0.12);

        this.color.r < 0 ? this.color.r = 0 : this.color.r -= 16;
        this.color.g < 0 ? this.color.g = 0 : this.color.g -= 8;
        this.color.b < 0 ? this.color.b = 0 : this.color.b -= 4;

        if (this.color.r + this.color.g + this.color.b === 0) return true;
      break;
      case 'propellant1':
        this.opacity -= 0.05;

        this.color.r < 0 ? this.color.r = 0 : this.color.r -= 4;
        this.color.g < 0 ? this.color.g = 0 : this.color.g -= 8;
        this.color.b < 0 ? this.color.b = 0 : this.color.b -= 16;

        this.size += 1;
      break;
      case 'propellant2':
        this.opacity -= 0.005;
      break;
      case 'condensate':
        this.opacity -= 0.005;
      break;
      case 'rotation':
        this.opacity -= 0.05;
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
        ctx.arc(this.x, this.y, Math.random() * this.size * this.intensity / 100, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        ctx.fill();
      break;
      case 'venting':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(this.size * this.intensity / 100 * 4, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = 3;
        ctx.lineWidth = 3 * 1 / this.size;
        ctx.stroke();
      break;
      case 'propellant1':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(this.size * 2 * this.intensity / 100, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = 2;
        ctx.stroke();
      break;
      case 'propellant2':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(this.size, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = this.size;
        ctx.stroke();
      break;
      case 'condensate':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(1, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = 1;
        ctx.stroke();
      break;
      case 'rotation':
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        p = pos(this.size * 3, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = 1;
        ctx.stroke();
      break;
    }

  }
}
