const globals = {
  stage: false,
  frame: 0,
}

/*****************************************************************************

 STATES

 titlescreen
 running
 paused
 gameover

 *****************************************************************************/

const state = {
  current: 'titlescreen',
  previous: '',
}

let setState = s => {
  state.previous = state.current;
  state.current = s;

  document.querySelector('body').classList.remove(state.previous);
  document.querySelector('body').classList.add(state.current);
}

/*****************************************************************************

 OBJECTS

 *****************************************************************************/

const particles = [];

let setStage = () => {

  for (let i = 0; i < 500; i++) {
    let p = new Particle();
    particles.push(p);
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
  if (globals.stage === false) {
    setStage();
    globals.stage = true;
  }

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
  ctx.clearRect(0,0,w,h);

  particles.forEach((e) => {
    e.draw();
  })
}

/*****************************************************************************

 FRAME

 *****************************************************************************/

let frame = setInterval(() => {
  if (state.current === 'running') {
    globals.frame++;
    update();
    draw();
  }
}, 16); // ~60fps
