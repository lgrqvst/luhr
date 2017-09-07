'use strict';

const VW = window.innerWidth;
const VH = window.innerHeight;

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



class Landingpad {
  constructor(x) {
    this.x = x;
  }

  draw(ctx) {
    // MAIN BODY

    ctx.beginPath();

    ctx.moveTo(this.x, VH - 100);

    ctx.bezierCurveTo(
      this.x - 3,
      VH - 100,
      this.x - 3,
      VH - 75,
      this.x - 3,
      VH
    );

    ctx.lineTo(this.x - 5, VH);

    ctx.bezierCurveTo(
      this.x - 5,
      VH - 100,
      this.x - 5,
      VH - 150,
      this.x - 50,
      VH - 150
    );

    ctx.lineTo(this.x - 50, VH - 153);

    ctx.lineTo(this.x - 40, VH - 159);

    ctx.lineTo(this.x - 40, VH - 162);

    // Right side mirrored

    ctx.lineTo(this.x + 40, VH - 162);

    ctx.lineTo(this.x + 40, VH - 159);

    ctx.lineTo(this.x + 50, VH - 153);

    ctx.lineTo(this.x + 50, VH - 150);

    ctx.bezierCurveTo(
      this.x + 5,
      VH - 150,
      this.x + 5,
      VH - 100,
      this.x + 5,
      VH
    );

    ctx.lineTo(this.x + 3, VH);

    ctx.bezierCurveTo(
      this.x + 3,
      VH - 75,
      this.x + 3,
      VH - 100,
      this.x,
      VH - 100
    );

    ctx.fillStyle = 'rgba(180,180,180,1)';
    ctx.fill();

    // Details

    ctx.beginPath();
    ctx.moveTo(this.x - 40, VH - 159);
    ctx.lineTo(this.x + 40, VH - 159);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x - 50, VH - 153);
    ctx.lineTo(this.x + 50, VH - 153);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();

    // Shadow underneath

    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath()
    ctx.moveTo(this.x - 50, VH - 150);
    ctx.lineTo(this.x + 50, VH - 150);
    ctx.lineTo(this.x + 50, VH - 50);
    ctx.fillStyle = 'rgba(120,120,120,1)';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
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
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.engineOn = false;
    this.fuel = 0;

    // Ship state would be things like 'landed', 'stabilizing', 'boosting',
    // 'thrusting', 'exploding', 'exploded', and so on, which would trigger a
    // different draw function
    this.state = 'landed';
  }

  draw(ctx) {

  }

  cw() {
    this.rotation += this.responsiveness;
  }

  ccw() {
    this.rotation -= this.responsiveness;
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

      ctx.beginPath();
      ctx.moveTo(this.x - h / 2, VH);
      ctx.lineTo(0.25 * xmod + (this.x - h / 2), VH - h * 1);
      ctx.lineTo(0.1 * xmod + (this.x - h * 4), VH - h / 4);

      ctx.lineTo(0.5 * xmod + (this.x - h), VH - h * 3);
      ctx.lineTo(0.6 * xmod + (this.x - h * 3), VH - h * 2.5);

      ctx.lineTo(0.7 * xmod + (this.x - h / 2), VH - h * 6);
      ctx.lineTo(0.8 * xmod + (this.x - h * 2), VH - h * 5);

      ctx.lineTo(1.25 * xmod + (this.x), VH - h * 10);

      ctx.lineTo(0.8 * xmod + (this.x + h * 2), VH - h * 5);
      ctx.lineTo(0.7 * xmod + (this.x + h / 2), VH - h * 6);

      ctx.lineTo(0.6 * xmod + (this.x + h * 3), VH - h * 2.5);
      ctx.lineTo(0.5 * xmod + (this.x + h), VH - h * 3);

      ctx.lineTo(0.1 * xmod + (this.x + h * 4), VH - h / 4);
      ctx.lineTo(0.25 * xmod + (this.x + h / 2), VH - h * 1);

      ctx.lineTo(this.x + h / 2, VH);

      ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
      ctx.fill();

    }

    if (this.type === 2) {
      // Draw type 2 tree, the mighty PINE
      // Actually, I think I'll just keep this kind of tree this way. Just a
      // trunk going straight up. It adds an interesting visual element to the
      // landscape.

      ctx.beginPath();
      ctx.moveTo(this.x - h * 0.5, VH);
      ctx.lineTo(0.25 * xmod + (this.x - h * 0.25), VH - h * 12);
      ctx.lineTo(0.25 * xmod + (this.x + h * 0.25), VH - h * 12);
      ctx.lineTo(this.x + h * 0.5, VH);

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
}

const controls = {

}

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

let setStage = () => {

  globals.wind = Math.round(Math.random() * 20 - 10);

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
    let distance = i + 1;
    let m = new Mountain(foot,height,peaks,color,distance);
    mountains.push(m)
  }

  // Create the landing pad
  let p = new Landingpad(Math.floor(Math.random() * (VW - 100)) + 50);
  landingpads.push(p);

  //Generate trees
  for (let i = 0; i < 60; i++) {
    let x = Math.round(Math.random() * VW);
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

  // Generate particles
  for (let i = 0; i < 200; i++) {
    let p = new Particle();
    particles.push(p);
    globals.stage = true;
  }

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

/*****************************************************************************

 UPDATE

 *****************************************************************************/

let update = () => {
  if (globals.stage === false) setStage();

  moons.forEach((e) => {
    e.move();
  })

  particles.forEach((e) => {
    e.drift();
    e.pulsate();
    e.flicker()
  })
}

/*****************************************************************************

 DRAW

 *****************************************************************************/

let draw = () => {
  // Clear the canvas
  context1.clearRect(0,0,VW,VH);
  context2.clearRect(0,0,VW,VH);

  let parallax = 1;

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

  landingpads.forEach((e) => {
    e.draw(context2);
  })

  trees.forEach((e) => {
    if (e.z === 2) {
      e.draw(context2,parallax);
    }
  })

  particles.forEach((e) => {
    e.draw(context2);
  })
}

/*****************************************************************************

 FRAME

 *****************************************************************************/

let frame = setInterval(() => {
  if (globals.state.current === 'running') {
    globals.frame++;
    update();
    draw();
  }
}, 16); // ~60fps
