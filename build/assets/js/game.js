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
const context3 = getContext(VW, VH, 'layer3');

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
        p = pos(2, 0);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
        // ctx.lineWidth = this.size * this.intensity / 100;
        ctx.lineWidth = 2;
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


class Landingpad {
  constructor(x) {
    this.x = x;
    this.apparentX = x + 75 * Math.round((VW / 2 - x) / (VW / 2) * 1000) / 1000;
    this.shadowAngle = 0;
  }

  update(m) {
    let a = angle(m, {x: this.x, y: VH - 150});
    // a += a < 0 ? Math.PI * 2 : 0;
    this.shadowAngle = a;
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
    ctx.lineWidth = 1.0;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - 50, VH - 153);
    ctx.lineTo(x + 50, VH - 153);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();

    // Shadow underneath

    // ctx.globalCompositeOperation = 'source-atop';
    // ctx.beginPath()
    // ctx.moveTo(x - 50, VH - 150);
    // ctx.lineTo(x + 50, VH - 150);
    // ctx.lineTo(x + 50, VH - 50);
    // ctx.fillStyle = 'rgba(120,120,120,1)';
    // ctx.fill();
    // ctx.globalCompositeOperation = 'source-over';

    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath()
    let midpointX = x - Math.cos(this.shadowAngle) * 100;
    let midpointY = VH - 150 - Math.sin(this.shadowAngle) * 100;
    let controlPointX = x - Math.cos(this.shadowAngle) * 50;
    let controlPointY = VH - 150 - Math.sin(this.shadowAngle) * 50;
    ctx.moveTo(x - 50, VH - 150);
    // ctx.lineTo(midpointX, midpointY);
    ctx.bezierCurveTo(
      controlPointX - 50,
      controlPointY,
      midpointX - 50,
      midpointY,
      midpointX,
      midpointY
    )
    // ctx.lineTo(x + 50, VH - 150);
    ctx.bezierCurveTo(
      midpointX + 50,
      midpointY,
      controlPointX + 50,
      controlPointY,
      x + 50,
      VH - 150
    )
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
    this.ax = 0;
    this.ay = 0;
    this.rotation = 270;

    this.shadowSide = 'left';
    this.shadowStrength = 0;

    // Operation
    this.shipOn = false;

    this.generatorOn = false;
    this.generatorEfficiency = 1; // How well the generator converts fuel to power. 1 fuel unit converts to this many power units.
    this.generatorLoad = 0; // Desired output from the generator. 100 is standard
    this.generatorOutput = 0; // Current power output from the generator
    this.generatorResponsiveness = 50; // How quickly the generator responds to load changes. Higher means slower
    this.generatorTemperature = 0; // Generator temperature above "room temperature"

    this.generalPower = 0;

    this.shieldsOn = false;
    this.shieldsPower = 0;
    this.shieldsStrength = 0;
    this.shieldsCondition = 100;

    this.weaponsOn = false;
    this.weaponsPower = 0;
    this.weaponsStrength = 0;

    this.harvestingOn = false;
    this.harvestingPower = 0;

    this.engineOn = false;
    this.enginePower = 0;
    this.engineEfficiency = 1;
    this.engineTemperature = 0;

    this.batteryChargingPower = 0;
    this.emergencyChargingPower = 0;
    this.ventPower = 0;

    this.primaryFuel = 1000;
    this.primaryFuelMax = 1000;
    this.secondaryFuel = 1000;
    this.secondaryFuelMax = 1000;
    this.oxidizer = 1000;
    this.oxidizerMax = 1000;
    this.coolant = 100;
    this.coolantMax = 100;
    this.battery = 0;
    this.batteryMax = 1000;
    this.emergencyPower = 100;
    this.emergencyPowerMax = 100;

    // Handling
    this.responsiveness = 100;
    this.moveSpeed = 0.07;
    this.boostSpeed = 0.14;
    this.turnSpeed = 2.5;

    // Status
    this.states = {
      powered: false,
      shielded: false,
      armed: false,
      harvesting: false,
      engineRunning: false,
      boosting: false,
      chargingBatteries: false,
      chargingEmergencyPower: false,
      landed: false,
      parked: false,
      landingPadContact: false,
      groundContact: false,
      landingPadProximity: false,
      groundProximity: false,
      flying: false,
      turningCw: false,
      turningCcw: false,
    }

    this.animationProps = {
      stabilizerRing: {
        current: 0,
        max: 100,
      }
    }
  }

  runGenerator() {
    if (this.primaryFuel > 0) {
      let d = this.generatorLoad - this.generatorOutput;
      let c = Math.ceil(Math.abs(d / this.generatorResponsiveness)) / 4;
      if (d < 0) {
        this.generatorOutput -= c;
      } else {
        this.generatorOutput += c;
      }
      this.generatorOutput = Math.round(this.generatorOutput * 100) / 100;

      if (this.generatorLoad > 100) {
        let a = this.generatorLoad - 100;
        this.generatorTemperature += Math.round(a / 500 * 100) / 100;
      } else if (this.generatorTemperature > 0) {
        this.generatorTemperature -= 0.1;
      } else if (this.generatorTemperature < 0) {
        this.generatorTemperature = 0;
      }

      this.primaryFuel -= 1 * this.generatorOutput / 100

      let power = this.generatorEfficiency * this.generatorOutput;

      let pos = local2global(this);
      let p1 = pos(this.r * -0.35, this.r * 0.32);
      let p2 = pos(this.r * -0.35, this.r * -0.32);

      return {
        power: power,
        p1: {
          x: p1.x,
          y: p1.y,
        },
        p2: {
          x: p2.x,
          y: p2.y,
        },
        intensity: this.generatorLoad
      };

    } else {
      this.generatorOn = false;
      this.generatorLoad = 0;
      controls.increaseGeneratorLoad = false;
      controls.decreaseGeneratorLoad = false;
      messageLog.push('Generator: Failure: Shut down initiated. Error code 0001');
      return false;
    }
  }

  increaseGeneratorLoad() {
    this.generatorLoad += 1;
  }

  decreaseGeneratorLoad() {
    this.generatorLoad -= 1;
    if (this.generatorLoad < 0) this.generatorLoad = 0;
  }

  coolDownGenerator() {
    // Should use coolant to lower generatorTemperature
    if (this.coolant > 0) {
      this.generatorTemperature -= 1;
      this.coolant -= 1;
    }
    if (this.generatorTemperature < 0) this.generatorTemperature = 0;
  }

  powerDownGenerator() {
    this.generatorOutput -= 0.5;
    this.generatorOutput = Math.round(this.generatorOutput * 100) / 100;
    if (this.generatorOutput < 0) this.generatorOutput = 0;

    if (this.generatorTemperature > 0) {
      this.generatorTemperature -= 1;
    } else if (this.generatorTemperature < 0) {
      this.generatorTemperature = 0;
    }

    if (this.generatorOutput <= 0) messageLog.push('Generator: Shut down complete');

    let power = this.generatorEfficiency * this.generatorOutput;

    let pos = local2global(this);
    let p1 = pos(this.r * -0.35, this.r * 0.32);
    let p2 = pos(this.r * -0.35, this.r * -0.32);

    return {
      power: power,
      p1: {
        x: p1.x,
        y: p1.y,
      },
      p2: {
        x: p2.x,
        y: p2.y,
      },
      intensity: this.generatorLoad
    };
  }

  resetPower() {
    this.generalPower = 0;
    this.shieldsPower = 0;
    this.weaponsPower = 0;
    this.harvestingPower = 0;
    this.enginePower = 0;
    this.batteryChargingPower = 0;
    this.emergencyChargingPower = 0;
    this.ventPower = 0;
  }

  distributePower(p,onBatteryPower) {
    // Power should be portioned out to ship systems according to this priority list
    // 1. General
    // 2. Shields
    // 3. Weapons
    // 4. Harvesting coils
    // 5. Engine
    // 6. Battergy charging
    // 7. Emergency power

    let distributedPower = {
      general: 0,
      shields: 0,
      weapons: 0,
      harvestingCoils: 0,
      engine: 0,
      batteryCharging: 0,
      emergencyCharging: 0,
      vent: 0
    }

    // Portion

    let distributePower = (available, channel, required) => {
      if (channel === 'engine') {
        distributedPower[channel] = Math.round(available / required * 100)
        return 0;
      } else {
        if (available > required) {
          distributedPower[channel] = 100;
          return available - required;
        } else {
          distributedPower[channel] = Math.round(available / required * 100);
          return 0;
        }
      }
    }

    if (this.shipOn) {

      p = distributePower(p,'general',5);

      if (this.shieldsOn && p > 0) p = distributePower(p,'shields',25);

      if (this.weaponsOn && p > 0) p = distributePower(p,'weapons',25);

      if (this.harvestingOn && p > 0) p = distributePower(p,'harvestingCoils',10);

      if (this.engineOn && p > 0) p = distributePower(p,'engine',45);

      if (p > 0 && this.battery < this.batteryMax && !onBatteryPower) p = distributePower(p,'batteryCharging',5);

      if (p > 0 && this.emergencyPower < this.emergencyPowerMax && !onBatteryPower) p = distributePower(p,'emergencyCharging',5);

      if (p > 0 && !onBatteryPower) distributedPower.vent = p;

      if (onBatteryPower) this.battery -= (100 - p) / 100;
      if (this.battery < 0) this.battery = 0;

    } else {

      distributedPower.vent = p;

    }

    // Distribute

    this.generalPower = distributedPower.general;
    this.shieldsPower = distributedPower.shields;
    this.weaponsPower = distributedPower.weapons;
    this.harvestingPower = distributedPower.harvestingCoils;
    this.enginePower = distributedPower.engine;
    this.batteryChargingPower = distributedPower.batteryCharging;
    this.emergencyChargingPower = distributedPower.emergencyCharging;
    this.ventPower = distributedPower.vent;

    // Set states

    if (this.generalPower === 100) this.states.powered = true;
    if (this.shieldsPower > 0) this.states.shielded = true;
    if (this.weaponsPower > 0) this.states.armed = true;
    if (this.harvestingPower > 0) this.states.harvesting = true;
    if (this.enginePower > 0) this.states.engineRunning = true;
    if (this.batteryChargingPower > 0) this.states.chargingBatteries = true;
    if (this.emergencyChargingPower > 0) this.states.chargingEmergencyPower = true;
  }

  chargeBatteries() {
    this.battery += Math.round(this.batteryChargingPower / 100 * 4) / 4;
    if (this.battery > this.batteryMax) this.battery = this.batteryMax;
  }

  chargeEmergencyPower() {
    this.emergencyPower += Math.round(this.emergencyChargingPower / 100 * 4) / 4;
    if (this.emergencyPower > this.emergencyPowerMax) this.emergencyPower = this.emergencyPowerMax;
  }

  runShields() {
    // Generate shields using shieldsPower
  }

  runWeapons() {
    // Power weapons using weaponsPower
  }

  runEngine() {
    // Drain secondaryFuel and oxidizer to eject propellant and increase ax and ay. Should return position and intensity of exhaust
    this.engineOn = true;

    if (this.secondaryFuel > 0 && this.oxidizer > 0) {
      if (this.enginePower <= 0) return false;
      let engineEffect = this.enginePower * this.engineEfficiency / 100;
      let fuelDrain = this.enginePower / 100;

      this.ax = Math.cos(rads(this.rotation)) * this.moveSpeed * engineEffect;
      this.ay = Math.sin(rads(this.rotation)) * this.moveSpeed * engineEffect;
      this.vx += this.ax;
      this.vy += this.ay;

      this.secondaryFuel -= engineEffect;
      this.oxidizer -= engineEffect;

      if (this.enginePower > 100) {
        let a = this.enginePower - 100;
        this.engineTemperature += Math.round(a / 500 * 100) / 50;
      }

      let pos = local2global(this);
      let p = pos(this.r * -0.45, this.r * 0);
      return {
        p: {
          x: p.x,
          y: p.y
        },
        intensity: this.enginePower
      };

    } else {
      this.secondaryFuel = 0;
      this.oxidizer = 0;
      return false;
    }
  }

  boostEngine() {
    // Drain secondaryFuel and oxidizer to eject propellant and increase ax and ay. Should return position and intensity of exhaust
    this.engineOn = true;

    if (this.secondaryFuel > 0 && this.oxidizer > 0) {
      if (this.enginePower <= 0) return false;
      let engineEffect = this.enginePower * this.engineEfficiency / 100;
      let fuelDrain = this.enginePower / 100;

      this.ax = Math.cos(rads(this.rotation)) * this.moveSpeed * engineEffect * 2;
      this.ay = Math.sin(rads(this.rotation)) * this.moveSpeed * engineEffect * 2;
      this.vx += this.ax;
      this.vy += this.ay;

      this.secondaryFuel -= engineEffect * 2;
      this.oxidizer -= engineEffect * 2;

      this.engineTemperature += 0.5;

      this.states.boosting = true;

      let pos = local2global(this);
      let p1 = pos(this.r * -0.45, this.r * 0);
      let p2 = pos(this.r * -0.35, this.r * 0.32);
      let p3 = pos(this.r * -0.35, this.r * -0.32);
      let p4 = pos(this.r * -0.38, this.r * 1.07);
      let p5 = pos(this.r * -0.38, this.r * -1.07);
      return {
        p1: {
          x: p1.x,
          y: p1.y
        },
        p2: {
          x: p2.x,
          y: p2.y
        },
        p3: {
          x: p3.x,
          y: p3.y
        },
        p4: {
          x: p4.x,
          y: p4.y
        },
        p5: {
          x: p5.x,
          y: p5.y
        },
        intensity: this.enginePower * 2
      };

    } else {
      this.secondaryFuel = 0;
      this.oxidizer = 0;
      return false;
    }
  }

  coolDownEngine() {
    // Should use coolant to lower generatorTemperature
    if (this.coolant > 0) {
      this.engineTemperature -= 1;
      this.coolant -= 1;
    }
    if (this.engineTemperature < 0) this.engineTemperature = 0;
  }

  ventExcessPower() {
    // Should zero ventPower and return a point and intensity for the power animation

    let pos = local2global(this);
    let p1 = pos(this.r * -0.35, this.r * 0.32);
    // let p1 = pos(this.r * 0.25, this.r * 0.425);
    let p2 = pos(this.r * -0.35, this.r * -0.32);
    // let p2 = pos(this.r * 0.25, this.r * -0.425);

    let r = {
      p1: {
        x: p1.x,
        y: p1.y,
      },
      p2: {
        x: p2.x,
        y: p2.y,
      },
      intensity: this.ventPower
    };

    this.ventPower = 0;

    return r;

  }

  rotateCw() {
    this.rotation += this.turnSpeed * this.responsiveness / 100;

    if (this.rotation < 0) this.rotation += 360;
    if (this.rotation > 360) this.rotation -= 360;

    let pos = local2global(this);
    let p = pos(this.r * -0.38, this.r * -1.07);
    return {x: p.x, y: p.y};
  }

  rotateCcw() {
    this.rotation -= this.turnSpeed * this.responsiveness / 100;

    if (this.rotation < 0) this.rotation += 360;
    if (this.rotation > 360) this.rotation -= 360;

    let pos = local2global(this);
    let p = pos(this.r * -0.38, this.r * 1.07);
    return {x: p.x, y: p.y};
  }

  evaluateStatus() {
    // Check things like engine temperature, generator temperature and stuff to decide if something should explode
  }

  move(m) {
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

    if (this.y + this.vy > VH - this.r * 3) {
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

    // If I'm going to do this 👇, then parallax has to go. If not, I need another solution. Bounce back just outside screen?
    // if (this.x > VW) this.x = 0;
    // if (this.x < 0) this.x = VW;

    if (!this.states.groundContact && !this.states.landingPadContact && !this.states.groundProximity && !this.states.landingPadProximity) {
      this.states.flying = true;
      this.vx += globals.wind / 300;
    }

    this.x += this.vx;
    this.y += this.vy;

    // console.log(this.states.landed ? 'landed' : '', this.states.parked ? 'parked' : '', this.states.landingPadContact ? 'landingPadContact' : '', this.states.groundContact ? 'groundContact' : '', this.states.landingPadProximity ? 'landingPadProximity' : '', this.states.groundProximity ? 'groundProximity' : '', this.states.flying ? 'flying' : '');

    let a = angle(m, {x: this.x, y: this.y});
    a += a <= 0 ? Math.PI * 2 : 0;
    a = degs(a);
    a = a % 360;

    let r = this.rotation;
    let d = (a - r + 360) % 360;
    this.shadowSide = (d <= 360 && d > 180) ? 'right' : 'left';

    d = d % 180;
    d = Math.abs(90 - d);
    d = 90 - d;
    d = d / 90;
    d = Math.round(d * 100) / 100;

    this.shadowStrength = d;
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
    // Also, this animation needs to be better.
    // Hiding this for now

    // if ((!this.states.landed && !this.states.parked)) {
    //   if (this.states.powered) {
    //     this.animationProps.stabilizerRing.current += this.animationProps.stabilizerRing.current < this.animationProps.stabilizerRing.max ? 2 : 0;
    //   } else {
    //     this.animationProps.stabilizerRing.current -= this.animationProps.stabilizerRing.current > 0 ? 2 : 0;
    //   }
    // } else {
    //   this.animationProps.stabilizerRing.current -= this.animationProps.stabilizerRing.current > 0 ? 2 : 0;
    // }
    //
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, r * this.animationProps.stabilizerRing.current / 100, 0, 2 * Math.PI);
    // ctx.closePath();
    // ctx.strokeStyle = "#FFF";
    // ctx.lineWidth = r / 10;
    // ctx.stroke();

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
    p = pos(r * -0.08, r * 1.06);
    ctx.moveTo(p.x, p.y);
    p = pos(r * 0.09, r * 1.06);
    ctx.lineTo(p.x, p.y);

    p = pos(r * -0.08, r * -1.06);
    ctx.moveTo(p.x, p.y);
    p = pos(r * 0.09, r * -1.06);
    ctx.lineTo(p.x, p.y);

    ctx.strokeStyle = "#555";
    ctx.lineWidth = r / 7;
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

      pos(r * -0.0, r * 0.405),

      pos(r * -0.7, r * 0.65),
      pos(r * -0.9, r * 0.9),
      pos(r * -0.9, r * 0.875),
      pos(r * -0.85, r * 0.675),

      pos(r * -0.4, r * 0.5),
      pos(r * -0.2, r * 0.4),
      pos(r * -0.1, r * 0.2),
      pos(r * -0.15, r * 0.15),
      // HALF WAY POINT
      pos(r * -0.15, r * -0.15),
      pos(r * -0.1, r * -0.2),
      pos(r * -0.2, r * -0.4),
      pos(r * -0.4, r * -0.5),

      pos(r * -0.85, r * -0.675),
      pos(r * -0.9, r * -0.875),
      pos(r * -0.9, r * -0.9),
      pos(r * -0.7, r * -0.65),

      pos(r * -0.0, r * -0.405),

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
    ];

    // Backup fuselage coords
    // p = [
    //   pos(r * 0.3475, r * 0.475),
    //   pos(r * 0.35, r * 0.55),
    //   pos(r * 0.3, r * 0.575),
    //   pos(r * 0.25, r * 0.425),
    //   pos(r * 0.2, r * 0.45),
    //   pos(r * 0.25, r * 0.6),
    //   pos(r * 0.2, r * 0.6),
    //   pos(r * 0.15, r * 0.5),
    //   pos(r * 0.1, r * 0.5),
    //   pos(r * 0, r * 0.85),
    //   pos(r * -0.15, r * 0.975),
    //   pos(r * -0.2, r * 1.2),
    //   pos(r * -0.3, r * 1.2),
    //   pos(r * -0.25, r * 0.75),
    //   pos(r * -0.375, r * 0.525),
    //   pos(r * -0.75, r * 0.675),
    //   pos(r * -0.8, r * 0.665),
    //   pos(r * -0.4, r * 0.5),
    //   pos(r * -0.2, r * 0.4),
    //   pos(r * -0.1, r * 0.2),
    //   pos(r * -0.15, r * 0.15),
    //
    //   pos(r * -0.15, r * -0.15),
    //   pos(r * -0.1, r * -0.2),
    //   pos(r * -0.2, r * -0.4),
    //   pos(r * -0.4, r * -0.5),
    //   pos(r * -0.8, r * -0.665),
    //   pos(r * -0.75, r * -0.675),
    //   pos(r * -0.375, r * -0.525),
    //   pos(r * -0.25, r * -0.75),
    //   pos(r * -0.3, r * -1.2),
    //   pos(r * -0.2, r * -1.2),
    //   pos(r * -0.15, r * -0.975),
    //   pos(r * 0, r * -0.85),
    //   pos(r * 0.1, r * -0.5),
    //   pos(r * 0.15, r * -0.5),
    //   pos(r * 0.2, r * -0.6),
    //   pos(r * 0.25, r * -0.6),
    //   pos(r * 0.2, r * -0.45),
    //   pos(r * 0.25, r * -0.425),
    //   pos(r * 0.3, r * -0.575),
    //   pos(r * 0.35, r * -0.55),
    //   pos(r * 0.3475, r * - 0.475),
    //
    //   pos(r * 1.2, r * -0.05)
    // ];

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, r, rads(this.rotation - 139), rads(this.rotation - 85));
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = r / 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, r, rads(this.rotation - 275), rads(this.rotation - 221));
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = r / 10;
    ctx.stroke();

    // WINGS

    ctx.beginPath();
    p = pos(r * 0.3, r * 0);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * 0, r * 0.85),
      pos(r * -0.15, r * 0.975),
      pos(r * -0.2, r * 1.2),
      pos(r * -0.3, r * 1.3),
      pos(r * -0.25, r * 0.75),
      pos(r * -0.375, r * 0.525)
    ];

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    ctx.beginPath();
    p = pos(r * 0.3, r * 0);
    ctx.moveTo(p.x, p.y);

    p = [
      pos(r * -0.375, r * -0.525),
      pos(r * -0.25, r * -0.75),
      pos(r * -0.3, r * -1.2),
      pos(r * -0.2, r * -1.3),
      pos(r * -0.15, r * -0.975),
      pos(r * 0, r * -0.85)
    ];

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
    if (this.states.boosting | this.states.turningCcw) {
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
    if (this.states.boosting || this.states.turningCw) {
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
    if (this.states.powered) ctx.fillStyle = "#88a";
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
    if (this.states.powered) ctx.fillStyle = "#bbd";
    ctx.fill();

    // SHADOW

    ctx.globalCompositeOperation = 'source-atop';
    ctx.beginPath()
    p = pos(r * 1.5, r * 0);
    ctx.moveTo(p.x, p.y);
    if (this.shadowSide === 'right') {
      p = [
        pos(r * 1.5, r * 1.5),
        pos(r * -1.5, r * 1.5),
        pos(r * -1.5, r * 0)
      ];
    } else {
      p = [
        pos(r * 1.5, r* -1.5),
        pos(r * -1.5, r* -1.5),
        pos(r * -1.5, r* 0)
      ];
    }

    p.forEach(function(e) {
      ctx.lineTo(e.x, e.y);
    });

    ctx.closePath();

    ctx.fillStyle = `rgba(0,0,0,${this.shadowStrength * 0.35})`;
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
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
    current: 'running',
    previous: '',
  },
  wind: 0,
  drag: 0,
  gravity: 0
}

const messageLog = [];

/*****************************************************************************

 CONTROLS

 *****************************************************************************/

const controls = {
  increaseGeneratorLoad: false,
  decreaseGeneratorLoad: false,
  runEngine: false,
  boostEngine: false,
  turnCw: false,
  turnCcw: false,
}

window.addEventListener('keydown',(e) => {
  let code = e.which;
  let s = ships[0];
  // console.log(code);

  if (s.generatorOn) {
    if (code === 80) {
      controls.increaseGeneratorLoad = true;
    }
    if (code === 76) {
      controls.decreaseGeneratorLoad = true;
    }
  }

  if (s.shipOn) {

  }

  if (s.states.powered) {
    if (code === 87) {
      controls.runEngine = true;
    }
    if (code === 68) {
      controls.turnCw = true;
    }
    if (code === 65) {
      controls.turnCcw = true;
    }
    if (code === 83) {
      controls.boostEngine = true;
    }
  }
});

window.addEventListener('keyup',(e) => {
  let code = e.which;
  let s = ships[0];
  // console.log(code);

  if (code === 84) {
    if (s.shipOn) {
      s.generatorOn = false;
      s.shieldsOn = false;
      s.weaponsOn = false;
      s.harvestingOn = false;
      s.generatorLoad = 0;
      messageLog.push('Ship: Powering down');
    } else {
      messageLog.push('Ship: Powering up');
    }
    s.shipOn = !s.shipOn;
  }

  if (s.shipOn) {
    if (code === 89) {
      if (!s.generatorOn) {
        messageLog.push('Generator: Start up sequence initiated');
      } else {
        messageLog.push('Generator: Shut down sequence initiated');
      }
      s.generatorOn = !s.generatorOn;
    }

    if (code === 85) {
      if (!s.shieldsOn) {
        messageLog.push('Shields: Activated');
      } else {
        messageLog.push('Shields: Deactivated');
      }
      s.shieldsOn = !s.shieldsOn;
    }

    if (code === 73) {
      if (!s.weaponsOn) {
        messageLog.push('Weapons: Activated');
      } else {
        messageLog.push('Weapons: Deactivated');
      }
      s.weaponsOn = !s.weaponsOn;
    }

    if (code === 72) {
      if (!s.harvestingOn) {
        messageLog.push('Harvesting Coils: Activated');
      } else {
        messageLog.push('Harvesting Coils: Deactivated');
      }
      s.harvestingOn = !s.harvestingOn;
    }
  }

  if (s.generatorOn) {
    if (code === 79) {
      s.generatorLoad = 100;
      messageLog.push('Generator: Load set to: 100%');
    }
    if (code === 75) {
      s.generatorLoad = 50;
      messageLog.push('Generator: Load set to: 50%');
    }
    if (code === 77) {
      s.generatorLoad = 0;
      messageLog.push('Generator: Load set to: 0%');
    }
    if (code === 80) {
      controls.increaseGeneratorLoad = false;
      messageLog.push('Generator: Increasing load to: ' + s.generatorLoad + '%');
    }
    if (code === 76) {
      controls.decreaseGeneratorLoad = false;
      messageLog.push('Generator: Decreasing load to: ' + s.generatorLoad + '%');
    }
  }

  if (code === 87) {
    controls.runEngine = false;
    s.engineOn = false;
  }
  if (code === 83) {
    controls.boostEngine = false;
    s.engineOn = false;
  }
  if (code === 68) {
    controls.turnCw = false;
  }
  if (code === 65) {
    controls.turnCcw = false;
  }

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
const exhaustGenerator = [];
const exhaustVenting = [];
const exhaustPropellant1 = [];
const exhaustPropellant2 = [];
const exhaustCondensate = [];
const exhaustRotation = [];

let setStage = () => {

  globals.wind = Math.round(Math.random() * 20 - 10);

  globals.drag = 0.995;

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

let angle = (a, b) => Math.atan2(a.y - b.y, a.x - b.x);

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
  s.states.powered = false;
  s.states.shielded = false;
  s.states.armed = false;
  s.states.harvesting = false;
  s.states.engineRunning = false;
  s.states.boosting = false;
  s.states.chargingBatteries = false;
  s.states.chargingEmergencyPower = false;
  s.states.turningCw = false;
  s.states.turningCcw = false;
  s.ax = 0;
  s.ay = 0;

  s.resetPower();

  // messageLog.length > 0 ? console.log(messageLog[messageLog.length - 1]) : '';

  if (controls.increaseGeneratorLoad) {
    s.increaseGeneratorLoad();
  }
  if (controls.decreaseGeneratorLoad) {
    s.decreaseGeneratorLoad();
  }

  if (s.generatorOn) {
    let g = s.runGenerator();
    if (g !== false) {
      s.distributePower(g.power, false);
      addExhaust('generator', g.p1, g.intensity, s);
      addExhaust('generator', g.p2, g.intensity, s);
    }
  }

  if (!s.generatorOn && s.generatorOutput > 0) {
    let g = s.powerDownGenerator();
    if (g !== false) {
      s.distributePower(g.power, false);
      addExhaust('generator', g.p1, g.intensity, s);
      addExhaust('generator', g.p2, g.intensity, s);
    }
  }

  if (s.shipOn) {
    if (s.battery > 0 && !s.generatorOn && s.generatorOutput === 0) {
      s.distributePower(100,true);
    }

    if (controls.runEngine) {
      let p = s.runEngine();
      if (p !== false) {
        addExhaust('propellant1', p.p, p.intensity, s);
        if (Math.random() < 0.08) addExhaust('propellant2', p.p, p.intensity, s);
      }
    }

    if (controls.boostEngine) {
      let p = s.boostEngine();
      if (p !== false) {
        addExhaust('propellant1', p.p1, p.intensity * 2, s);
        addExhaust('propellant1', p.p2, p.intensity * 0.25, s);
        addExhaust('propellant1', p.p3, p.intensity * 0.25, s);
        addExhaust('venting', p.p4, p.intensity, s, s.rotation + 180)
        addExhaust('venting', p.p5, p.intensity, s, s.rotation + 180)
        if (Math.random() < 0.08) addExhaust('propellant2', p.p1, p.intensity, s);
        if (Math.random() < 0.08) addExhaust('propellant2', p.p2, p.intensity, s);
        if (Math.random() < 0.08) addExhaust('propellant2', p.p3, p.intensity, s);
      }
    }

    if (controls.turnCw) {
      let p = s.rotateCw();
      s.states.turningCw = true;
      addExhaust('rotation', p, 1, s, s.rotation + 170);
    }

    if (controls.turnCcw) {
      let p = s.rotateCcw();
      s.states.turningCcw = true;
      addExhaust('rotation', p, 1, s, s.rotation + 190);
    }

    if (s.batteryChargingPower > 0) {
      s.chargeBatteries();
    }

    if (s.emergencyChargingPower > 0) {
      s.chargeEmergencyPower();
    }

    if (s.engineTemperature > 0) {
      if (!s.engineOn) s.engineTemperature -= 0.2;
      if (s.engineTemperature < 0) s.engineTemperature = 0;
    }

    if (s.generatorTemperature > 0) {
      if (!s.generatorOn) s.generatorTemperature -= 0.2;
      if (s.generatorTemperature < 0) s.generatorTemperature = 0;
    }

    if (s.generatorTemperature > 10) {
      s.coolDownGenerator();
      if (Math.random() < 0.25) addExhaust('condensate', {x: s.x, y: s.y}, 1, s);
    }

    if (s.engineTemperature > 10) {
      s.coolDownEngine();
      if (Math.random() < 0.25) addExhaust('condensate', {x: s.x, y: s.y}, 1, s);
    }
  }

  if (s.ventPower > 0) {
    let p = s.ventExcessPower();
    // addExhaust('venting', p.p1, p.intensity, s, s.rotation + 45);
    // addExhaust('venting', p.p2, p.intensity, s, s.rotation + 315);
    addExhaust('venting', p.p1, p.intensity, s, s.rotation + 180);
    addExhaust('venting', p.p2, p.intensity, s, s.rotation + 180);
  }

  s.evaluateStatus();
  s.move({x: moons[0].x - moons[0].r * 0.75, y: moons[0].y});
}

let addExhaust = (type, p, i, s, r) => {
  let c,e;
  switch (type) {
    case 'generator':
      c = {
        r: 255,
        g: 255,
        b: 255
      }
      e = new Exhaust(p.x, p.y, s.rotation + 180, 0.5, type, 1.5, i, c, 0.5);
      exhaustGenerator.push(e);
    break;

    case 'venting':
      c = {
        r: 170,
        g: 255,
        b: 250
      }
      // e = new Exhaust(p.x, p.y, r, 0.5, type, 1.25, i, c, 1);
      e = new Exhaust(p.x, p.y, r, 0.25, type, 1, i, c, 1);
      exhaustVenting.push(e);
    break;

    case 'propellant1':
      c = {
        r: 255,
        g: 255,
        b: 255
      }
      e = new Exhaust(p.x, p.y, s.rotation + 180, 4, type, 2, i, c, 1);
      exhaustPropellant1.push(e);
    break;

    case 'propellant2':
      c = Math.random() < 0.5 ? {r: 0,g: 0,b: 0} : {r: 200,g: 200,b: 200};
      // c = {
      //   r: Math.ceil(150 * Math.random()),
      //   g: Math.ceil(150 * Math.random()),
      //   b: Math.ceil(150 * Math.random())
      // }
      e = new Exhaust(p.x, p.y, s.rotation + 180, 5, type, 1, i, c, 0.9);
      exhaustPropellant2.push(e);
    break;

    case 'condensate':
      c = {
        r: 255,
        g: 255,
        b: 255
      }
      e = new Exhaust(p.x, p.y, s.rotation + 180, Math.hypot(s.vx,s.vy), type, 1, i, c, 1);
      exhaustCondensate.push(e);
    break;

    case 'rotation':
      c = {
        r: 255,
        g: 255,
        b: 255
      }
      e = new Exhaust(p.x, p.y, r, 3, type, 2, i, c, 0.8);
      exhaustRotation.push(e);
    break;
  }
}

let handleExhaust = () => {

  let a = [];
  exhaustGenerator.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustGenerator.length = 0;
  a.forEach((e) => {
    exhaustGenerator.push(e);
  })

  a = [];
  exhaustVenting.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustVenting.length = 0;
  a.forEach((e) => {
    exhaustVenting.push(e);
  })

  a = [];
  exhaustPropellant1.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustPropellant1.length = 0;
  a.forEach((e) => {
    exhaustPropellant1.push(e);
  })

  a = [];
  exhaustPropellant2.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustPropellant2.length = 0;
  a.forEach((e) => {
    exhaustPropellant2.push(e);
  })

  a = [];
  exhaustCondensate.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustCondensate.length = 0;
  a.forEach((e) => {
    exhaustCondensate.push(e);
  })

  a = [];
  exhaustRotation.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  exhaustRotation.length = 0;
  a.forEach((e) => {
    exhaustRotation.push(e);
  })

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

  landingpads.forEach((e) => {
    e.update({x: moons[0].x, y: moons[0].y});
  })

  handleShip(ships[0]);

  handleExhaust();

}

/*****************************************************************************

 HUD

 *****************************************************************************/

let updateHUD = (s) => {
  if (s.states.powered) {
    document.querySelector('.hud').classList.remove('inactive');
    document.querySelector('.hud').classList.add('active');

    let r = Math.floor(s.rotation) - 270;
    if (r < 0) r+= 360;
    document.querySelector('.hud .shipStatus').style.setProperty("--rotation", r);
    document.querySelector('.hud .shipStatus .rotation .readout').innerHTML = r;

    document.querySelector('.hud .engineOutput').style.setProperty("--engineOutput", s.generatorOutput);
    let engineOutputColor = '#0c9';
    if (s.generatorOutput > 110) engineOutputColor = '#9c0';
    if (s.generatorOutput > 175) engineOutputColor = '#d00';
    document.querySelector('.hud .engineOutput').style.setProperty("--engineOutputColor", engineOutputColor);
    document.querySelector('.hud .engineOutput .left .readout').innerHTML = Math.floor(s.generatorOutput);
    document.querySelector('.hud .engineOutput .right .readout').innerHTML = Math.floor(s.generatorOutput);

    let a = Math.floor(((s.y - VH + s.r) * -1) / VH * 100 / 2);
    if (a > 100) {
      a = 100;
      document.querySelector('.hud .shipStatus .altitude').classList.add('critical');
    } else {
      document.querySelector('.hud .shipStatus .altitude').classList.remove('critical');
    }
    document.querySelector('.hud .shipStatus').style.setProperty("--altitude", a);

    let ax = Math.round(s.ax * 800);
    let ay = Math.round(s.ay * 800 * -1);
    if (ax > 200) ax = 200;
    if (ax < -200) ax = -200;
    if (ay > 200) ay = 200;
    if (ay < -200) ay = -200;
    ax += 200;
    ay += 200;
    ax /= 4;
    ay /= 4;
    document.querySelector('.hud .shipStatus').style.setProperty('--accelerationHorizontal',ax);
    document.querySelector('.hud .shipStatus').style.setProperty('--accelerationVertical',ay);

    let vx = Math.round(s.vx / 14 * 100);
    let vy = Math.round(s.vy * -1 / 14 * 100);
    let vxp = 0;
    let vxn = 0;
    let vxc = false;
    if (vx > 50) {
      vx = 50;
      vxc = true;
    }
    if (vx < -50) {
      vx = -50;
      vxc = true;
    }
    if (vx > 0) {
      vxp = vx;
    } else if (vx < 0) {
      vxn = vx * -1;
    }
    let vyp = 0;
    let vyn = 0;
    let vyc = false;
    if (vy > 50) {
      vy = 50;
      vyc = true;
    }
    if (vy < -50) {
      vy = -50;
      vyc = true;
    }
    if (vy > 0) {
      vyp = vy;
    } else if (vy < 0) {
      vyn = vy * -1;
    }
    if (vxc) {
      document.querySelector('.hud .shipStatus .speedHorizontal').classList.add('critical');
    } else {
      document.querySelector('.hud .shipStatus .speedHorizontal').classList.remove('critical');
    }
    if (vyc) {
      document.querySelector('.hud .shipStatus .speedVertical').classList.add('critical');
    } else {
      document.querySelector('.hud .shipStatus .speedVertical').classList.remove('critical');
    }
    document.querySelector('.hud .shipStatus').style.setProperty('--speedHorizontalPositive',vxp);
    document.querySelector('.hud .shipStatus').style.setProperty('--speedHorizontalNegative',vxn);
    document.querySelector('.hud .shipStatus').style.setProperty('--speedVerticalPositive',vyp);
    document.querySelector('.hud .shipStatus').style.setProperty('--speedVerticalNegative',vyn);

  } else {
    document.querySelector('.hud').classList.remove('active');
    document.querySelector('.hud').classList.add('inactive');
    let criticals = document.querySelectorAll('.hud *')
    criticals.forEach((e) => {
      e.classList.remove('critical');
    });
  }
}

/*****************************************************************************

 DRAW

 *****************************************************************************/

let draw = () => {
  // Clear the canvases
  context1.clearRect(0,0,VW,VH);
  context2.clearRect(0,0,VW,VH);
  context3.clearRect(0,0,VW,VH);

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

  exhaustGenerator.forEach((e) => {
    e.draw(context2);
  })

  exhaustVenting.forEach((e) => {
    e.draw(context2);
  })

  exhaustPropellant1.forEach((e) => {
    e.draw(context2);
  })

  exhaustPropellant2.forEach((e) => {
    e.draw(context2);
  })

  exhaustCondensate.forEach((e) => {
    e.draw(context2);
  })

  exhaustRotation.forEach((e) => {
    e.draw(context2);
  })

  particles.forEach((e) => {
    e.draw(context2);
  })

  ships[0].draw(context3);

  updateHUD(ships[0]);
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
