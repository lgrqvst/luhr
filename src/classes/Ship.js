import store from '../store/store';

class Ship {
  constructor() {
    console.log("Ship's here");
  }

  draw = ctx => {
    const { scrollX, scrollY, width, height } = store.getState().stage;
    let { x, y } = store.getState().ship;
    x = (scrollX - x - width / 2) * -1;
    y = (scrollY - y - height / 2) * -1;

    // const { r } = store.getState().ship.details;
    const r = 35;

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, r * -1);
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
}

export default Ship;
