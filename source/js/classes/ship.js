class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.engineOn = false;
    this.fuel = 0;
    this.responsiveness = 1;

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
