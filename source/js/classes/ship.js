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
        this.generatorTemperature -= 1;
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

      this.engineTemperature += 0.25;

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
    // let p1 = pos(this.r * -0.35, this.r * 0.32);
    let p1 = pos(this.r * 0.25, this.r * 0.425);
    // let p2 = pos(this.r * -0.35, this.r * -0.32);
    let p2 = pos(this.r * 0.25, this.r * -0.425);

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
  }
}
