import store from '../store/store';

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw = ctx => {
    const { x, y } = this;
    // const { r } = store.getState().ship.details;
    const r = 35;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
}

export default Ship;
