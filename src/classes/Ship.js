import store from '../store/store';
import * as actionCreators from '../store/actions/';
import { rads } from '../utility';

class Ship {
  constructor() {
    console.log("Ship's here");
    this.radius = 35;

    this.speed = 10;
    this.speedRotate = 2;
  }

  update = () => {
    const { x, y, rotation } = store.getState().ship;
    const { pressed } = store.getState().input;
    const shipData = {
      x: x,
      y: y,
      rotation: rotation
    };

    if (pressed.thrust) {
      // console.log('Thrust!');
      shipData.y -= this.speed;
    }

    if (pressed.boost) {
      // console.log('Boost!');
      shipData.y += this.speed;
    }

    if (pressed.rotateCw) {
      // console.log('Clockwise!');
      // shipData.rotation += this.speedRotate;
      shipData.x += this.speed;
    }

    if (pressed.rotateCcw) {
      // console.log('Counter-clockwise!');
      // shipData.rotation -= this.speedRotate;
      shipData.x -= this.speed;
    }

    if (shipData.x !== x || shipData.y !== y) {
      store.dispatch(actionCreators.updateShip(shipData));
    }
  };

  draw = ctx => {
    const { scrollX, scrollY, width, height } = store.getState().stage;
    let { x, y, rotation } = store.getState().ship;
    x = (scrollX - x - width / 2) * -1;
    y = (scrollY - y - height / 2) * -1;

    const r = this.radius;

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(rads(rotation));
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
}

export default Ship;
