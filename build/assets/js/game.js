'use strict';

const VW = window.innerWidth;
const VH = window.innerHeight - 10;

let getContext = (w, h, c) => {
  let canvas = document.createElement("canvas");
  canvas.classList.add(c);
  document.body.appendChild(canvas);
  canvas.width = w || window.innerWidth;
  canvas.height = h || window.innerHeight;
  return canvas.getContext("2d");
}

const context1 = getContext(VW, VH, 'layer1');
const context2 = getContext(VW, VH, 'layer2');

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

class Exhaust {
  constructor(x,y,vx,vy,type,color,opacity) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.color = color;
    this.opacity = opacity;
  }

  move() {

  }

  draw() {

  }
}

class Landingpad {
  constructor(x) {
    this.x = x;
    this.apparentX = x + 75 * Math.round((VW / 2 - x) / (VW / 2) * 1000) / 1000;
  }

  draw(ctx, plx) {
    // MAIN BODY

    this.apparentX = this.x + plx * 1.75;
    let x = this.apparentX;

    ctx.beginPath();

    ctx.moveTo(x, VH - 100);

    ctx.bezierCurveTo(
      x - 3,
      VH - 100,
      x - 3,
      VH - 75,
      x - 3,
      VH
    );

    ctx.lineTo(x - 5, VH);

    ctx.bezierCurveTo(
      x - 5,
      VH - 100,
      x - 5,
      VH - 150,
      x - 50,
      VH - 150
    );

    ctx.lineTo(x - 50, VH - 153);

    ctx.lineTo(x - 40, VH - 159);

    ctx.lineTo(x - 40, VH - 162);

    // Right side mirrored

    ctx.lineTo(x + 40, VH - 162);

    ctx.lineTo(x + 40, VH - 159);

    ctx.lineTo(x + 50, VH - 153);

    ctx.lineTo(x + 50, VH - 150);

    ctx.bezierCurveTo(
      x + 5,
      VH - 150,
      x + 5,
      VH - 100,
      x + 5,
      VH
    );

    ctx.lineTo(x + 3, VH);

    ctx.bezierCurveTo(
      x + 3,
      VH - 75,
      x + 3,
      VH - 100,
      x,
      VH - 100
    );

    ctx.fillStyle = 'rgba(180,180,180,1)';
    ctx.fill();

    // Details

    ctx.beginPath();
    ctx.moveTo(x - 40, VH - 159);
    ctx.lineTo(x + 40, VH - 159);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 50, VH - 153);
    ctx.lineTo(x + 50, VH - 153);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();

    // Shadow underneath

    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath()
    ctx.moveTo(x - 50, VH - 150);
    ctx.lineTo(x + 50, VH - 150);
    ctx.lineTo(x + 50, VH - 50);
    ctx.fillStyle = 'rgba(120,120,120,1)';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // ctx.beginPath();
    //
    // ctx.moveTo(this.x, VH - 100);
    //
    // ctx.bezierCurveTo(
    //   this.x - 3,
    //   VH - 100,
    //   this.x - 3,
    //   VH - 75,
    //   this.x - 3,
    //   VH
    // );
    //
    // ctx.lineTo(this.x - 5, VH);
    //
    // ctx.bezierCurveTo(
    //   this.x - 5,
    //   VH - 100,
    //   this.x - 5,
    //   VH - 150,
    //   this.x - 50,
    //   VH - 150
    // );
    //
    // ctx.lineTo(this.x - 50, VH - 153);
    //
    // ctx.lineTo(this.x - 40, VH - 159);
    //
    // ctx.lineTo(this.x - 40, VH - 162);
    //
    // // Right side mirrored
    //
    // ctx.lineTo(this.x + 40, VH - 162);
    //
    // ctx.lineTo(this.x + 40, VH - 159);
    //
    // ctx.lineTo(this.x + 50, VH - 153);
    //
    // ctx.lineTo(this.x + 50, VH - 150);
    //
    // ctx.bezierCurveTo(
    //   this.x + 5,
    //   VH - 150,
    //   this.x + 5,
    //   VH - 100,
    //   this.x + 5,
    //   VH
    // );
    //
    // ctx.lineTo(this.x + 3, VH);
    //
    // ctx.bezierCurveTo(
    //   this.x + 3,
    //   VH - 75,
    //   this.x + 3,
    //   VH - 100,
    //   this.x,
    //   VH - 100
    // );
    //
    // ctx.fillStyle = 'rgba(180,180,180,1)';
    // ctx.fill();
    //
    // // Details
    //
    // ctx.beginPath();
    // ctx.moveTo(this.x - 40, VH - 159);
    // ctx.lineTo(this.x + 40, VH - 159);
    // ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    // ctx.stroke();
    //
    // ctx.beginPath();
    // ctx.moveTo(this.x - 50, VH - 153);
    // ctx.lineTo(this.x + 50, VH - 153);
    // ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    // ctx.stroke();
    //
    // // Shadow underneath
    //
    // ctx.globalCompositeOperation = 'source-atop';
    // ctx.beginPath()
    // ctx.moveTo(this.x - 50, VH - 150);
    // ctx.lineTo(this.x + 50, VH - 150);
    // ctx.lineTo(this.x + 50, VH - 50);
    // ctx.fillStyle = 'rgba(120,120,120,1)';
    // ctx.fill();
    // ctx.globalCompositeOperation = 'source-over';
  }
}

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

class Particle {
  constructor() {
    this.x = Math.round(Math.random() * VW);
    this.y = Math.round(Math.random() * VH);

    this.energy = Math.round(Math.random() * 1000);

    this.radiusFactor = 200;
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

  draw(ctx) {
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
    if (this.x > VW + this.energy / this.radiusFactor) this.x = 0;
    if (this.x < 0 - this.energy / this.radiusFactor) this.x = VW;
    if (this.y > VH + this.energy / this.radiusFactor) this.y = 0;
    if (this.y < 0 - this.energy / this.radiusFactor) this.y = VH;
    if (Math.abs(this.targetX - this.x) < 10 || Math.abs(this.targetX - this.x) > 100) this.targetX = this.x + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
    if (Math.abs(this.targetY - this.y) < 10 || Math.abs(this.targetY - this.y) > 100) this.targetY = this.y + (this.driftDistance - Math.round(Math.random() * this.driftDistance * 2));
  }

  pulsate() {
    let r = (this.targetRadiusFactor - this.radiusFactor) / 70;
    this.radiusFactor += r;

    if (this.radiusFactor < 125) this.targetRadiusFactor += 50;
    if (this.radiusFactor > 225) this.targetRadiusFactor -= 50;

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

class Ship {
  constructor(x, y) {
    // Rendering
    this.x = x;
    this.y = y;
    this.r = 15;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 270;

    // Operation
    this.engineOn = false;
    this.engineOutput = 0;

    // Handling
    this.responsiveness = 100;
    this.moveSpeed = 0.07;
    this.boostSpeed = 0.1;
    this.turnSpeed = 2.5;

    // this.currentPowerMod = 0;
    // this.standardPowerMod = 1;
    // this.boostPowerMod = 1.5;
    // this.stabilizerPowerMod = 0.5;

    // this.primaryFuel = 0;
    // this.secondaryFuel = 0;

    // Status

    // Ship state would be things like 'landed', 'stabilizing', 'boosting',
    // 'thrusting', 'exploding', 'exploded', and so on, which would trigger a
    // difference in the draw function
    this.state = 'landed';
  }

  runEngine() {
    // if (this.engineOutput < 100) this.engineOutput += 0.5;
    if (this.engineOutput < 100) this.engineOutput += 5;
    if (this.engineOutput > 101) this.engineOutput -= 1;

    let pos = local2global(this);
    let p = pos(this.r * -0.45, this.r * 0)
    return {x: p.x, y: p.y};
  }

  powerDownEngine() {
    if (this.engineOutput > 0) this.engineOutput -= 0.5;
  }

  cw() {
    this.rotation += this.turnSpeed * this.responsiveness / 100 * this.engineOutput / 100;
  }

  ccw() {
    this.rotation -= this.turnSpeed * this.responsiveness / 100 * this.engineOutput / 100;
  }

  primaryThruster() {
    this.vy += Math.sin(rads(this.rotation)) * this.moveSpeed * this.engineOutput / 100;
    this.vx += Math.cos(rads(this.rotation)) * this.moveSpeed * this.engineOutput / 100;
  }

  secondaryThruster() {

  }

  move() {
    let landed = false;

    if (this.y !== VH - this.r) this.vy += globals.gravity;

    if (this.y + this.vy > VH - this.r) {
      this.y = VH - this.r;
      this.vy *= -0.3;
      this.vx *= 0.3;
    }

    if (landingpads[0].apparentX - 40 < this.x && this.x < landingpads[0].apparentX + 40 && this.y + this.vy > VH - 162 - this.r && this.y <= VH - 162 - this.r) {
      // Maybe rotate to face up and set state to landed?
      landed = true;
      this.y = VH - 162 - this.r;
      this.vy *= -0.3;
      this.vx *= 0.3;
    }

    this.vx = Math.round(this.vx * 1000) / 1000;
    this.vy = Math.round(this.vy * 1000) / 1000;

    let dx = this.vx;
    if (this.y !== VH - this.r && !landed) dx += globals.wind / 100;

    // If I'm going to do this 👇, then parallax has to go. If not, I need another solution. Bounce back just outside screen?
    // if (this.x > VW) this.x = 0;
    // if (this.x < 0) this.x = VW;

    this.x += dx;
    this.y += this.vy;
  }

  draw(ctx) {

    let pos = local2global(this);
    let r = this.r;
    let p;

    // FORWARD GUNS

    // Let's hold off on designing the guns for now. This might not be what I'll end up wanting.

    // ctx.beginPath();
    // p = pos(r * -0.1, r * 0.65);
    // ctx.moveTo(p.x, p.y);
    // p = pos(r * 1, r * 0.65);
    // ctx.lineTo(p.x, p.y);
    //
    // ctx.strokeStyle = "#bbb";
    // ctx.lineWidth = r / 18;
    // ctx.stroke();
    //
    // ctx.beginPath();
    // p = pos(r * 0.95, r * 0.65);
    // ctx.moveTo(p.x, p.y);
    // p = pos(r * 1.2, r * 0.65);
    // ctx.lineTo(p.x, p.y);
    //
    // ctx.strokeStyle = "#888";
    // ctx.lineWidth = r / 12;
    // ctx.lineCap = 'round';
    // ctx.stroke();
    // ctx.lineCap = 'square';
    //
    // ctx.beginPath();
    // p = pos(r * -0.1, r * -0.65);
    // ctx.moveTo(p.x, p.y);
    // p = pos(r * 1, r * -0.65);
    // ctx.lineTo(p.x, p.y);
    //
    // ctx.strokeStyle = "#bbb";
    // ctx.lineWidth = r / 18;
    // ctx.stroke();
    //
    // ctx.beginPath();
    // p = pos(r * 0.95, r * -0.65);
    // ctx.moveTo(p.x, p.y);
    // p = pos(r * 1.2, r * -0.65);
    // ctx.lineTo(p.x, p.y);
    //
    // ctx.strokeStyle = "#888";
    // ctx.lineWidth = r / 12;
    // ctx.lineCap = 'round';
    // ctx.stroke();
    // ctx.lineCap = 'square';

    // STABILIZER RING
    // This should only render for certain ship states -- or should it??? Have a think about this.
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = r / 10;
    ctx.stroke();

    // PRIMARY THRUSTER

    ctx.beginPath();
    p = pos(r * -0.15, r * 0.125);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * -0.4, r * 0.2),
      pos(r * -0.45, r * 0.175),

      pos(r * -0.45, r * -0.175),
      pos(r * -0.4, r * -0.2),

      pos(r * -0.15, r * -0.125)
    ]

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#333";
    ctx.fill();

    // SECONDARY THRUSTERS

    ctx.beginPath();
    p = pos(r * 0, r * 0.32);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.35, r * 0.32);
    ctx.lineTo(p.x, p.y);

    p = pos(r * 0, r * -0.32);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.35, r * -0.32);
    ctx.lineTo(p.x, p.y);

    ctx.strokeStyle = "#666";
    ctx.lineWidth = r / 8;
    ctx.stroke();

    // PRIMARY THRUSTER POWER CONDUITS

    ctx.beginPath();
    p = pos(r * -0.3, r * 0.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * 0.05, r* 0.5);
    ctx.lineTo(p.x, p.y);

    p = pos(r * -0.4, r * 0.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.05, r* 0.5);
    ctx.lineTo(p.x, p.y);

    p = pos(r * -0.3, r * -0.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * 0.05, r* -0.5);
    ctx.lineTo(p.x, p.y);

    p = pos(r * -0.4, r * -0.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.05, r* -0.5);
    ctx.lineTo(p.x, p.y);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = r / 20;
    ctx.stroke();

    // TERTIARY (NAVIGATIONAL) THRUSTERS

    ctx.beginPath();
    p = pos(r * -0.25, r * 1.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.38, r * 1.07)
    ctx.lineTo(p.x, p.y);

    p = pos(r * -0.25, r * -1.1);
    ctx.moveTo(p.x, p.y);
    p = pos(r * -0.38, r * -1.07)
    ctx.lineTo(p.x, p.y);

    ctx.strokeStyle = "#555";
    ctx.lineWidth = r / 10;
    ctx.stroke();

    // MAIN FUSELAGE

    ctx.beginPath();
    p = pos(r * 1.2, r * 0.05);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * 0.3475, r * 0.475),
      pos(r * 0.35, r * 0.55),
      pos(r * 0.3, r * 0.575),
      pos(r * 0.25, r * 0.425),
      pos(r * 0.2, r * 0.45),
      pos(r * 0.25, r * 0.6),
      pos(r * 0.2, r * 0.6),
      pos(r * 0.15, r * 0.5),
      pos(r * 0.1, r * 0.5),
      pos(r * 0, r * 0.85),
      pos(r * -0.15, r * 0.975),
      pos(r * -0.2, r * 1.2),
      pos(r * -0.3, r * 1.2),
      pos(r * -0.25, r * 0.75),
      pos(r * -0.375, r * 0.525),
      pos(r * -0.75, r * 0.675),
      pos(r * -0.8, r * 0.665),
      pos(r * -0.4, r * 0.5),
      pos(r * -0.2, r * 0.4),
      pos(r * -0.1, r * 0.2),
      pos(r * -0.15, r * 0.15),

      pos(r * -0.15, r * -0.15),
      pos(r * -0.1, r * -0.2),
      pos(r * -0.2, r * -0.4),
      pos(r * -0.4, r * -0.5),
      pos(r * -0.8, r * -0.665),
      pos(r * -0.75, r * -0.675),
      pos(r * -0.375, r * -0.525),
      pos(r * -0.25, r * -0.75),
      pos(r * -0.3, r * -1.2),
      pos(r * -0.2, r * -1.2),
      pos(r * -0.15, r * -0.975),
      pos(r * 0, r * -0.85),
      pos(r * 0.1, r * -0.5),
      pos(r * 0.15, r * -0.5),
      pos(r * 0.2, r * -0.6),
      pos(r * 0.25, r * -0.6),
      pos(r * 0.2, r * -0.45),
      pos(r * 0.25, r * -0.425),
      pos(r * 0.3, r * -0.575),
      pos(r * 0.35, r * -0.55),
      pos(r * 0.3475, r * - 0.475),

      pos(r * 1.2, r * -0.05)
    ]

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    // AILERONS

    ctx.beginPath();
    p = pos(r * -0.45, r * 0.85);
    ctx.moveTo(p.x, p.y);
    p = [
      pos(r * -0.65, r * 1.07),
      pos(r * -0.85, r * 1.1),
      pos(r * -0.65, r * 0.7),
    ];
    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    ctx.beginPath();
    p = pos(r * -0.45, r * -0.85);
    ctx.moveTo(p.x, p.y);
    p = [
      pos(r * -0.65, r * -1.07),
      pos(r * -0.85, r * -1.1),
      pos(r * -0.65, r * -0.7),
    ];
    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    // COCKPIT

    ctx.beginPath();
    p = pos(r * 1, r * 0.075);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * 0.4, r * 0.35),
      pos(r * 0.375, r * 0.275),
      pos(r * 0.5, r * 0.15),

      pos(r * 0.5, r * -0.15),
      pos(r * 0.375, r * -0.275),
      pos(r * 0.4, r * -0.35),

      pos(r * 1, r * -0.075)
    ]

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#447";
    if (this.engineOn) ctx.fillStyle = "#88a";
    ctx.fill();

    ctx.beginPath();
    p = pos(r * 1, r * 0.075);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * 0.5, r * 0.15),
      pos(r * 0.5, r * -0.15),

      pos(r * 1, r * -0.075)
    ]

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "#447";
    if (this.engineOn) ctx.fillStyle = "#bbd";
    ctx.fill();
  }
}


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

    let x = this.x + plx * 1.75;

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

      // ctx.beginPath();
      // ctx.moveTo(this.x - h / 2, VH);
      // ctx.lineTo(0.25 * xmod + (this.x - h / 2), VH - h * 1);
      // ctx.lineTo(0.1 * xmod + (this.x - h * 4), VH - h / 4);
      //
      // ctx.lineTo(0.5 * xmod + (this.x - h), VH - h * 3);
      // ctx.lineTo(0.6 * xmod + (this.x - h * 3), VH - h * 2.5);
      //
      // ctx.lineTo(0.7 * xmod + (this.x - h / 2), VH - h * 6);
      // ctx.lineTo(0.8 * xmod + (this.x - h * 2), VH - h * 5);
      //
      // ctx.lineTo(1.75 * xmod + (this.x), VH - h * 10);
      //
      // ctx.lineTo(0.8 * xmod + (this.x + h * 2), VH - h * 5);
      // ctx.lineTo(0.7 * xmod + (this.x + h / 2), VH - h * 6);
      //
      // ctx.lineTo(0.6 * xmod + (this.x + h * 3), VH - h * 2.5);
      // ctx.lineTo(0.5 * xmod + (this.x + h), VH - h * 3);
      //
      // ctx.lineTo(0.1 * xmod + (this.x + h * 4), VH - h / 4);
      // ctx.lineTo(0.25 * xmod + (this.x + h / 2), VH - h * 1);
      //
      // ctx.lineTo(this.x + h / 2, VH);

      ctx.beginPath();
      ctx.moveTo(x - h / 2, VH);
      ctx.lineTo(0.25 * xmod + (x - h / 2), VH - h * 1);
      ctx.lineTo(0.1 * xmod + (x - h * 4), VH - h / 4);

      ctx.lineTo(0.5 * xmod + (x - h), VH - h * 3);
      ctx.lineTo(0.6 * xmod + (x - h * 3), VH - h * 2.5);

      ctx.lineTo(0.7 * xmod + (x - h / 2), VH - h * 6);
      ctx.lineTo(0.8 * xmod + (x - h * 2), VH - h * 5);

      ctx.lineTo(1.75 * xmod + (x), VH - h * 10);

      ctx.lineTo(0.8 * xmod + (x + h * 2), VH - h * 5);
      ctx.lineTo(0.7 * xmod + (x + h / 2), VH - h * 6);

      ctx.lineTo(0.6 * xmod + (x + h * 3), VH - h * 2.5);
      ctx.lineTo(0.5 * xmod + (x + h), VH - h * 3);

      ctx.lineTo(0.1 * xmod + (x + h * 4), VH - h / 4);
      ctx.lineTo(0.25 * xmod + (x + h / 2), VH - h * 1);

      ctx.lineTo(x + h / 2, VH);

      ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
      ctx.fill();

    }

    if (this.type === 2) {
      // Draw type 2 tree, the mighty PINE
      // Actually, I think I'll just keep this kind of tree this way. Just a
      // trunk going straight up. It adds an interesting visual element to the
      // landscape.

      // ctx.beginPath();
      // ctx.moveTo(this.x - h * 0.5, VH);
      // ctx.lineTo(0.25 * xmod + (this.x - h * 0.25), VH - h * 12);
      // ctx.lineTo(0.25 * xmod + (this.x + h * 0.25), VH - h * 12);
      // ctx.lineTo(this.x + h * 0.5, VH);

      ctx.beginPath();
      ctx.moveTo(x - h * 0.5, VH);
      ctx.lineTo(0.25 * xmod + (x - h * 0.25), VH - h * 12);
      ctx.lineTo(0.25 * xmod + (x + h * 0.25), VH - h * 12);
      ctx.lineTo(x + h * 0.5, VH);

      ctx.fillStyle = `rgba(${this.color.r + 50},${this.color.g + 10},${this.color.b + 10},1)`;
      ctx.fill();
    }
  }
}

const globals = {
  stage: false,
  frame: 0,
  state: {
    current: 'titlescreen',
    previous: '',
  },
  wind: 0,
  gravity: 0
}

/*****************************************************************************

 CONTROLS

 *****************************************************************************/

const controls = {
  primaryThruster: false,
  turnCw: false,
  turnCcw: false,
  // boost: false,
  // stabilize: false,
  // turnReset: false,
  // maintain: false,
}

window.addEventListener('keydown',(e) => {
  // console.log(e.which);
  let code = e.which;
  if (code === 87) controls.primaryThruster = true;
  if (code === 65) controls.turnCcw = true;
  if (code === 68) controls.turnCw = true;
  // if (code === 83) controls.boost = true;
  // if (code === 69) controls.stabilize = true;
  // if (code === 82) controls.turnReset = true;
  // if (code === 84) controls.maintain = true;

  if (code === 81) {
    ships[0].engineOn = !ships[0].engineOn;
  }
});

window.addEventListener('keyup',(e) => {
  let code = e.which;
  if (code === 87) controls.primaryThruster = false;
  if (code === 65) controls.turnCcw = false;
  if (code === 68) controls.turnCw = false;
  // if (code === 83) controls.boost = false;
  // if (code === 69) controls.stabilize = false;
  // if (code === 82) controls.turnReset = false;
  // if (code === 84) controls.maintain = false;
});

/*****************************************************************************

 STATES

 titlescreen
 running
 paused
 gameover

 *****************************************************************************/

let setState = s => {
  globals.state.previous = globals.state.current;
  globals.state.current = s;

  document.querySelector('body').classList.remove(globals.state.previous);
  document.querySelector('body').classList.add(globals.state.current);
}

/*****************************************************************************

 OBJECTS

 *****************************************************************************/

const particles = [];
const moons = [];
const mountains = [];
const landingpads = [];
const trees = [];
const buildings = [];
const ships = [];
const primaryExhaust = [];
const secondaryExhaust = [];
const tertiaryExhaust = [];

let setStage = () => {

  globals.wind = Math.round(Math.random() * 20 - 10);

  globals.gravity = 0.03;

  // Create the moon(s?)
  let m = new Moon(Math.floor(Math.random() * VW), VH * 0.75, 75);
  moons.push(m);

  // Generate mountains
  for (let i = 0; i < 5; i++) {
    let foot = Math.floor(Math.random() * VW  - VW / 2);
    // let height = Math.random() * 40 + 10;
    let height = Math.random() * ((4 - i) * 10) + 10;
    let peaks = Math.ceil(Math.random() * 3);
    let color = {r: Math.floor(Math.random() * 40), g: 0, b: Math.floor(Math.random() * 40), a: 1};
    // Higher = farther away = more parallax
    let distance = i + 1;
    let m = new Mountain(foot,height,peaks,color,distance);
    mountains.push(m)
  }

  // Create the landing pad
  let p = new Landingpad(Math.floor(Math.random() * (VW - 100)) + 50);
  landingpads.push(p);

  //Generate trees
  for (let i = 0; i < 150; i++) {
    let x = Math.round(Math.random() * VW * 1.5 - VW * 0.25);
    // I want more trees of type 1 than type 2
    let type = Math.floor(Math.random() * 100 + 1) <= 85 ? 1 : 2;
    let z = type === 2 ? 2 : Math.floor(Math.random() * 2 + 1);
    let h = Math.round(Math.random() * 30 + 15);
    let color = {
      r: Math.round(Math.random() * 50 + 50),
      g: Math.round(Math.random() * 50 + 0),
      b: Math.round(Math.random() * 50 + 50)
    }
    let t = new Tree(x,z,type,h,color);
    trees.push(t);
  }

  // Generate buildings
  for (let i = 0; i < 5; i++) {
    let x = Math.round(Math.random() * VW);
    let type = 1;
    let height = Math.round(Math.random() * 20 + 20);
    let color = {}
    color.r = color.g = color.b = Math.round(Math.random() * 75 + 50);
    let b = new Building(x,type,height,color);
    buildings.push(b);
  }

  // Generate particles
  for (let i = 0; i < 200; i++) {
    let p = new Particle();
    particles.push(p);
    globals.stage = true;
  }

  // Create ship
  let s = new Ship(landingpads[0].apparentX, VH - 162 - 15);
  // let s = new Ship(VW / 2, VH / 2);
  ships.push(s);

}

/*****************************************************************************

 TRIGONOMETRY FUNCTIONS

 Also add functions for:
 line-line intersections
 other intersections
 direction from one point to another

 *****************************************************************************/

let distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

let rads = degs => degs * Math.PI / 180;

let degs = rads => rads * 180 / Math.PI;

let local2global = (self) => {
  let r = rads(self.rotation) || 0;
  return (x1, y1) => {
    // Make the passed-in local coordinates global using the magic of trigonometry and the provided rotation

    let l = Math.hypot(x1,y1);
    let a = Math.atan2(y1,x1) + r;
    // Keep the below bit for now. Don't know if I'll need it later.
    // a += a < 0 ? Math.PI * 2 : 0;
    // a += r;

    let x2 = self.x + Math.cos(a) * l;
    let y2 = self.y + Math.sin(a) * l;

    return {x: x2, y: y2};
  };
}

/*****************************************************************************

 SHIP HANDLING

 *****************************************************************************/

let handleShip = (s) => {
  if (s.engineOn) {
    let p = s.runEngine();

    // Use the returned position when generating exhaust. Use the ship's rotation to determine vector. (Maybe return that as well???)
  }

  if (!s.engineOn && s.engineOutput > 0){
    s.powerDownEngine();
  }

  // Controls

  if (s.engineOutput > 0) {
    if (controls.primaryThruster) {
      s.primaryThruster();
    }
    if (controls.turnCw) {
      s.cw();
    }
    if (controls.turnCcw) {
      s.ccw();
    }
  }

  // Update position of ship

  s.move();
}

/*****************************************************************************

 UPDATE

 *****************************************************************************/

let update = () => {
  moons.forEach((e) => {
    e.move();
  })

  particles.forEach((e) => {
    e.drift();
    e.pulsate();
    e.flicker()
  })

  handleShip(ships[0]);
}

/*****************************************************************************

 DRAW

 *****************************************************************************/

let draw = () => {
  // Clear the canvases
  context1.clearRect(0,0,VW,VH);
  context2.clearRect(0,0,VW,VH);

  let parallax = 50 * Math.round((VW / 2 - ships[0].x) / (VW / 2) * 1000) / 1000;

  moons.forEach((e) => {
    e.draw(context1);
  })

  mountains.forEach((e) => {
    e.draw(context1,parallax);
  })

  trees.forEach((e) => {
    if (e.z === 1) {
      e.draw(context1,parallax);
    }
  })

  buildings.forEach((e) => {
    e.draw(context1,parallax)
  })

  landingpads.forEach((e) => {
    e.draw(context2,parallax);
  })

  trees.forEach((e) => {
    if (e.z === 2) {
      e.draw(context2,parallax);
    }
  })

  particles.forEach((e) => {
    e.draw(context2);
  })

  ships[0].draw(context2);
}

/*****************************************************************************

 FRAME

 *****************************************************************************/

let frame = setInterval(() => {
  if (globals.state.current === 'running') {
    if (globals.stage === false) setStage();
    globals.frame++;
    update();
    draw();
  }
}, 16); // ~60fps
