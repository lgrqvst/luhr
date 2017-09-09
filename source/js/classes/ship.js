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
    this.boostSpeed = 0.14;
    this.turnSpeed = 2.5;

    this.states = {
      landed: false,
      parked: false,
      landingPadContact: false,
      groundContact: false,
      landingPadProximity: false,
      groundProximity: false,
      flying: false,
      primaryThruster: false,
      secondaryThruster: false,
      turningCw: false,
      turningCcw: false,
    }

    this.animationProps = {
      stabilizerRing: {
        current: 0,
        max: 100,
      }
    }

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
    if (this.engineOutput < 100) this.engineOutput += 0.5;
    // if (this.engineOutput < 100) this.engineOutput += 5;
    if (this.engineOutput > 101) this.engineOutput -= 1;

    let pos = local2global(this);
    let p = pos(this.r * -0.45, this.r * 0);
    return {x: p.x, y: p.y};
  }

  powerDownEngine() {
    if (this.engineOutput > 0) this.engineOutput -= 0.5;

    let pos = local2global(this);
    let p = pos(this.r * -0.45, this.r * 0);
    return {x: p.x, y: p.y};
  }

  primaryThruster() {
    this.vy += Math.sin(rads(this.rotation)) * this.moveSpeed * this.engineOutput / 100;
    this.vx += Math.cos(rads(this.rotation)) * this.moveSpeed * this.engineOutput / 100;

    let pos = local2global(this);
    let p = pos(this.r * -0.45, this.r * 0);
    return {x: p.x, y: p.y};
  }

  secondaryThruster() {
    this.vy += Math.sin(rads(this.rotation)) * this.boostSpeed * this.engineOutput / 100;
    this.vx += Math.cos(rads(this.rotation)) * this.boostSpeed * this.engineOutput / 100;

    let pos = local2global(this);
    let p1 = pos(this.r * -0.45, this.r * 0);
    let p2 = pos(this.r * -0.35, this.r * 0.32);
    let p3 = pos(this.r * -0.35, this.r * -0.32);
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      x3: p3.x,
      y3: p3.y
    };
  }

  cw() {
    this.rotation += this.turnSpeed * this.responsiveness / 100 * this.engineOutput / 100;

    if (this.rotation < 0) this.rotation += 360;
    if (this.rotation > 360) this.rotation -= 360;

    let pos = local2global(this);
    let p = pos(this.r * -0.38, this.r * -1.07);
    return {x: p.x, y: p.y};
  }

  ccw() {
    this.rotation -= this.turnSpeed * this.responsiveness / 100 * this.engineOutput / 100;

    if (this.rotation < 0) this.rotation += 360;
    if (this.rotation > 360) this.rotation -= 360;

    let pos = local2global(this);
    let p = pos(this.r * -0.38, this.r * 1.07);
    return {x: p.x, y: p.y};
  }

  move() {
    this.states.landed = false;
    this.states.parked = false;
    this.states.landingPadContact = false;
    this.states.groundContact = false;
    this.states.landingPadProximity = false;
    this.states.groundProximity = false;
    this.states.flying = false;

    // this.vx += globals.wind / 200;
    this.vx *= globals.drag;
    // this.vy *= globals.drag;;

    // if (this.y !== VH - this.r) this.vy += globals.gravity;
    this.vy += globals.gravity;

    if (this.y + this.vy > VH - this.r * 4) {
      this.states.groundProximity = true;
    }

    if (landingpads[0].apparentX - 40 < this.x && this.x < landingpads[0].apparentX + 40 && this.y + this.vy > VH - 162 - this.r * 4 && this.y <= VH - 162 - this.r) {
      this.states.landingPadProximity = true;
    }

    if (this.y + this.vy > VH - this.r) {
      this.y = VH - this.r;
      this.vy *= -0.3;
      this.vx *= 0.3;

      // Set state to parked if requirements are met
      if (Math.abs(this.vx) < 0.1 &&  Math.abs(this.vy) < 0.1 && this.rotation % 360 < 280 && this.rotation % 360 > 260) {
        this.states.parked = true;
      }
      this.states.groundContact = true;
    }

    if (landingpads[0].apparentX - 40 < this.x && this.x < landingpads[0].apparentX + 40 && this.y + this.vy > VH - 162 - this.r && this.y <= VH - 162 - this.r) {
      // Maybe rotate to face up and set state to landed?
      this.y = VH - 162 - this.r;
      this.vy *= -0.3;
      this.vx *= 0.3;

      // Set state to landed if requirements are met
      if (Math.abs(this.vx) < 0.1 &&  Math.abs(this.vy) < 0.1 && this.rotation % 360 < 280 && this.rotation % 360 > 260) {
        this.states.landed = true;
      }
      this.states.landingPadContact = true;
    }

    this.vx = Math.round(this.vx * 1000) / 1000;
    this.vy = Math.round(this.vy * 1000) / 1000;

    // this.vx += this.vx > 0 ? globals.drag * -1 : globals.drag;

    // console.log(this.vx, dx);
    // console.log('after: ' + dx);
    // If I'm going to do this 👇, then parallax has to go. If not, I need another solution. Bounce back just outside screen?
    // if (this.x > VW) this.x = 0;
    // if (this.x < 0) this.x = VW;

    if (!this.states.groundContact && !this.states.landingPadContact) {
      this.states.flying = true;
      this.vx += globals.wind / 300;
    }

    this.x += this.vx;
    this.y += this.vy;

    // console.log(this.states.landed ? 'landed' : '', this.states.parked ? 'parked' : '', this.states.landingPadContact ? 'landingPadContact' : '', this.states.groundContact ? 'groundContact' : '', this.states.landingPadProximity ? 'landingPadProximity' : '', this.states.groundProximity ? 'groundProximity' : '', this.states.flying ? 'flying' : '');
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

    if ((!this.states.landed && !this.states.parked)) {
      if (this.engineOn) {
        this.animationProps.stabilizerRing.current += this.animationProps.stabilizerRing.current < this.animationProps.stabilizerRing.max ? 2 : 0;
      } else {
        this.animationProps.stabilizerRing.current -= this.animationProps.stabilizerRing.current > 0 ? 2 : 0;
      }
    } else {
      this.animationProps.stabilizerRing.current -= this.animationProps.stabilizerRing.current > 0 ? 2 : 0;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, r * this.animationProps.stabilizerRing.current / 100, 0, 2 * Math.PI);
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
    if (this.states.secondaryThruster) {
      p = [
        pos(r * -0.95, r * 1.02),
        pos(r * -1, r * 0.9),
        pos(r * -0.65, r * 0.7),
      ];
    }
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
    if (this.states.secondaryThruster) {
      p = [
        pos(r * -0.95, r * -1.02),
        pos(r * -1, r * -0.9),
        pos(r * -0.65, r * -0.7),
      ];
    }
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
