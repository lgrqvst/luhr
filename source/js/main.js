const globals = {
  stage: false,
  frame: 0,
  state: {
    current: 'titlescreen',
    previous: '',
  },
  wind: 0,
}

/*****************************************************************************

 CONTROLS

 *****************************************************************************/

const controls = {
  main: false,
  turnCw: false,
  turnCcw: false,
  boost: false,
  stabilize: false,
  turnReset: false,
  maintain: false,
}

window.addEventListener('keydown',(e) => {
  // console.log(e.which);
  let code = e.which;
  if (code === 87) controls.main = true;
  if (code === 65) controls.turnCcw = true;
  if (code === 68) controls.turnCw = true;
  if (code === 83) controls.boost = true;
  if (code === 69) controls.stabilize = true;
  if (code === 82) controls.turnReset = true;
  if (code === 84) controls.maintain = true;
});

window.addEventListener('keyup',(e) => {
  let code = e.which;
  if (code === 87) controls.main = false;
  if (code === 65) controls.turnCcw = false;
  if (code === 68) controls.turnCw = false;
  if (code === 83) controls.boost = false;
  if (code === 69) controls.stabilize = false;
  if (code === 82) controls.turnReset = false;
  if (code === 84) controls.maintain = false;
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
  for (let i = 0; i < 100; i++) {
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

  buildings.forEach((e) => {
    e.draw(context1,parallax)
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
