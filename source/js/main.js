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
  runEngine: false
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
    if (code === 87) {
      controls.runEngine = true;
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
      messageLog.push('Generator: Load set to: 100');
    }
    if (code === 75) {
      s.generatorLoad = 0;
      messageLog.push('Generator: Load set to: 0');
    }
    if (code === 80) {
      controls.increaseGeneratorLoad = false;
      messageLog.push('Generator: Increasing load to: ' + s.generatorLoad);
    }
    if (code === 76) {
      controls.decreaseGeneratorLoad = false;
      messageLog.push('Generator: Decreasing load to: ' + s.generatorLoad);
    }
  }

  if (code === 87) {
    controls.runEngine = false;
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
const primaryExhaustIdle = [];
const primaryExhaust = [];
const secondaryExhaust = [];
const tertiaryExhaust = [];

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
  s.states.primaryThruster = false;
  s.states.secondaryThruster = false;
  s.states.turningCw = false;
  s.states.turningCcw = false;

  messageLog.length > 0 ? console.log(messageLog[messageLog.length - 1]) : '';

  if (controls.increaseGeneratorLoad) {
    s.increaseGeneratorLoad();
  }
  if (controls.decreaseGeneratorLoad) {
    s.decreaseGeneratorLoad();
  }

  if (s.generatorOn) {
    let generatedPower = s.runGenerator();
    let distributedPower = s.distributePower(generatedPower);
    powerShip(distributedPower,s);
  }

  if (!s.generatorOn && s.generatorOutput > 0) {
    let generatedPower = s.powerDownGenerator();
    let distributedPower = s.distributePower(generatedPower);
    powerShip(distributedPower,s);
  }

  if (s.shipOn) {
    if (controls.runEngine) {
      s.runEngine();
    }
  }

  if (s.ventPower > 0) {
    s.ventExcessPower();
  }

  // if (s.engineOn) {
  //   if (s.primaryFuel > 0) {
  //     let p = s.runEngine();
  //
  //     addExhaust('idle',s,p);
  //   } else {
  //     s.engineOn = false;
  //   }
  // }

  // if (!s.engineOn && s.engineOutput > 0){
  //   let p = s.powerDownEngine();
  //   addExhaust('idle',s,p);
  // }

  // Controls

  // if (s.engineOutput > 0) {
  //   if (controls.secondaryThruster) {
  //     let p = s.secondaryThruster();
  //     s.states.primaryThruster = true;
  //     s.states.secondaryThruster = true;
  //
  //     addExhaust('primary',s,{x: p.x1, y: p.y1});
  //     addExhaust('secondary',s,p);
  //
  //   } else if (controls.primaryThruster) {
  //     let p = s.primaryThruster();
  //     s.states.primaryThruster = true;
  //
  //     addExhaust('primary',s,p);
  //   }
  //
  //   if (controls.turnCw) {
  //     let p = s.cw();
  //     s.states.turningCw = true;
  //
  //     addExhaust('tertiaryCw',s,p);
  //   }
  //
  //   if (controls.turnCcw) {
  //     let p = s.ccw();
  //     s.states.turningCcw = true;
  //
  //     addExhaust('tertiaryCcw',s,p);
  //   }
  // }

  s.move();
}

let powerShip = (distributedPower,s) => {
  s.generalPower = distributedPower.general;
  s.shieldsPower = distributedPower.shields;
  s.weaponsPower = distributedPower.weapons;
  s.harvestingPower = distributedPower.harvestingCoils;
  s.enginePower = distributedPower.engine;
  s.batteryChargingPower = distributedPower.batteryCharging;
  s.emergencyChargingPower = distributedPower.emergencyCharging;
  s.ventPower = distributedPower.vent;
}

let addExhaust = (type, s, p) => {
  if (type === 'idle') {
    let c = {
      r: 150,
      g: 150,
      b: 150
    }
    let e = new Exhaust(p.x, p.y, s.rotation + 180, 2, 'idle', 5, (s.engineOutput > 150 ? 150 : s.engineOutput), c, 0.5);
    primaryExhaustIdle.push(e);

  } else if (type === 'primary') {
    let c = {
      r: 200,
      g: 200,
      b: 200
    }
    let e = new Exhaust(p.x, p.y, s.rotation + 180, 5, 'primary', 10, s.engineOutput, c, 1);
    primaryExhaust.push(e);

  } else if (type === 'secondary') {
    let c = {
      r: Math.round(Math.random() * 55 + 200),
      g: Math.round(Math.random() * 55 + 200),
      b: Math.round(Math.random() * 55 + 200)
    }
    let e = new Exhaust(p.x2, p.y2, s.rotation + 180, 10, 'secondary', 10, s.engineOutput, c, 1);
    secondaryExhaust.push(e);

    e = new Exhaust(p.x3, p.y3, s.rotation + 180, 10, 'secondary', 10, s.engineOutput, c, 1);
    secondaryExhaust.push(e);

  } else if (type === 'tertiaryCw') {
    let c = {
      r: 200,
      g: 200,
      b: 200
    }
    let e = new Exhaust(p.x, p.y, s.rotation + 165, 4, 'tertiary', 2, s.engineOutput, c, 1);
    tertiaryExhaust.push(e);
  } else if (type === 'tertiaryCcw') {
    let c = {
      r: 200,
      g: 200,
      b: 200
    }
    let e = new Exhaust(p.x, p.y, s.rotation + 195, 4, 'tertiary', 2, s.engineOutput, c, 1);
    tertiaryExhaust.push(e);
  }
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

  let a = [];
  primaryExhaustIdle.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  primaryExhaustIdle.length = 0;
  a.forEach((e) => {
    primaryExhaustIdle.push(e);
  })

  a = [];
  primaryExhaust.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  primaryExhaust.length = 0;
  a.forEach((e) => {
    primaryExhaust.push(e);
  })

  a = [];
  secondaryExhaust.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  secondaryExhaust.length = 0;
  a.forEach((e) => {
    secondaryExhaust.push(e);
  })

  a = [];
  tertiaryExhaust.forEach((e) => {
    if (!e.fade() && !e.move()) {
      a.push(e);
    }
  })
  tertiaryExhaust.length = 0;
  a.forEach((e) => {
    tertiaryExhaust.push(e);
  })

}

/*****************************************************************************

 HUD

 *****************************************************************************/

let updateHUD = (s) => {
  if (s.engineOutput > 0) {
    document.querySelector('.hud').classList.remove('inactive');
    document.querySelector('.hud').classList.add('active');

    let r = Math.floor(s.rotation) - 270;
    if (r < 0) r+= 360;
    document.querySelector('.hud .shipStatus').style.setProperty("--rotation", r);
    document.querySelector('.hud .shipStatus .rotation .readout').innerHTML = r;

    // document.querySelector('.hud .engineOutput').style.setProperty("--engineOutput", s.engineOutput);
    // let engineOutputColor = '#0c9';
    // if (s.engineOutput > 110) engineOutputColor = '#9c0';
    // if (s.engineOutput > 175) engineOutputColor = '#d00';
    // document.querySelector('.hud .engineOutput').style.setProperty("--engineOutputColor", engineOutputColor);
    // document.querySelector('.hud .engineOutput .left .readout').innerHTML = Math.floor(s.engineOutput);
    // document.querySelector('.hud .engineOutput .right .readout').innerHTML = Math.floor(s.engineOutput);

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

  primaryExhaustIdle.forEach((e) => {
    e.draw(context2);
  })

  primaryExhaust.forEach((e) => {
    e.draw(context2);
  })

  secondaryExhaust.forEach((e) => {
    e.draw(context2);
  })

  tertiaryExhaust.forEach((e) => {
    e.draw(context2);
  })

  particles.forEach((e) => {
    e.draw(context2);
  })

  ships[0].draw(context2);

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
