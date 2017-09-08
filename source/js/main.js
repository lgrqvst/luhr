const globals = {
  stage: false,
  frame: 0,
  state: {
    current: 'running',
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
const primaryExhaustIdle = [];
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

    let c = {
      r: 150,
      g: 150,
      b: 150
    }
    if (!controls.primaryThruster) {
      let e = new Exhaust(p.x, p.y, s.rotation + 180, 0.01, 'smoke', 1, c, 1);
      primaryExhaustIdle.push(e);
    }
  }

  if (!s.engineOn && s.engineOutput > 0){
    s.powerDownEngine();
  }

  // Controls

  if (s.engineOutput > 0) {
    if (controls.primaryThruster) {
      let p = s.primaryThruster();

      let c = {
        r: 200,
        g: 200,
        b: 200
      }
      let e = new Exhaust(p.x, p.y, s.rotation + 180, 5, 'line', 10, c, 1);
      primaryExhaust.push(e);
    }
    if (controls.turnCw) {
      let p = s.cw();

      let c = {
        r: 200,
        g: 200,
        b: 200
      }
      let e = new Exhaust(p.x, p.y, s.rotation + 165, 4, 'quick', 2, c, 1);
      tertiaryExhaust.push(e);
    }
    if (controls.turnCcw) {
      let p = s.ccw();

      let c = {
        r: 200,
        g: 200,
        b: 200
      }
      let e = new Exhaust(p.x, p.y, s.rotation + 195, 4, 'quick', 2, c, 1);
      tertiaryExhaust.push(e);
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

  tertiaryExhaust.forEach((e) => {
    e.draw(context2);
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