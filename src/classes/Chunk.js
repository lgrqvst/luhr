import { chunkSize } from '../data/levels';
import store from '../store/store';

class Chunk {
  seed0 = Math.random();
  seed1 = Math.random();
  // seed2 = Math.random();
  // seed3 = Math.random();
  // seed4 = Math.random();
  // seed5 = Math.random();
  // seed6 = Math.random();
  // seed7 = Math.random();
  // seed8 = Math.random();
  // seed9 = Math.random();

  constructor(descriptor, x, y) {
    this.id = `x${x}y${y}`;
    this.x = x;
    this.y = y;

    this.terrainArray = descriptor.split(':')[0].split('');
    this.terrainType = this.terrainArray[0];

    if (descriptor.split(':').length > 1) {
      this.objectsArray = descriptor.split(':')[1].split('');
      this.objectType = this.objectsArray[0];
    }

    this.realLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, control1: { x: 0, y: 0 }, control2: { x: 0, y: 0 } };

    const c = i => {
      return parseInt(`0x${this.terrainArray[i]}`);
    };

    switch (this.terrainType) {
      case '_':
        this.realLine.start = { x: 0, y: c(1) };
        this.realLine.end = { x: 10, y: c(1) };
        this.realLine.control1 = { ...this.realLine.start };
        this.realLine.control2 = { ...this.realLine.end };
        break;
      case '-':
        this.realLine.start = { x: 0, y: c(1) };
        this.realLine.end = { x: 10, y: c(2) };
        this.realLine.control1 = { ...this.realLine.start, x: this.seed0 * 5 + 2.5 };
        this.realLine.control2 = { ...this.realLine.end, x: this.seed1 * 5 + 2.5 };
        break;
      case '|':
        this.realLine.start = { x: c(1), y: 0 };
        this.realLine.end = { x: c(2), y: 10 };
        this.realLine.control1 = { ...this.realLine.start, y: this.seed0 * 5 + 2.5 };
        this.realLine.control2 = { ...this.realLine.end, y: this.seed1 * 5 + 2.5 };
        break;
      case '(':
        this.realLine.start = { x: 0, y: c(1) };
        this.realLine.end = { x: c(2), y: 0 };
        this.realLine.control1 = { ...this.realLine.start, x: ((this.seed0 * c(2)) / 3) * 2 + c(2) / 3 };
        this.realLine.control2 = { ...this.realLine.end, y: ((this.seed1 * c(1)) / 3) * 2 + c(1) / 3 };
        break;
      case ')':
        this.realLine.start = { x: c(1), y: 0 };
        this.realLine.end = { x: 10, y: c(2) };
        this.realLine.control1 = { ...this.realLine.start, y: (this.seed0 * c(2)) / 2 + c(2) / 3 };
        this.realLine.control2 = { ...this.realLine.end, x: ((10 - c(1)) / 3) * 2 * this.seed1 + c(1) };
        break;
      case '/':
        this.realLine.start = { x: c(1), y: 10 };
        this.realLine.end = { x: 10, y: c(2) };
        this.realLine.control1 = { ...this.realLine.start, y: ((10 - c(2)) / 3) * 2 * this.seed0 + c(2) };
        this.realLine.control2 = { ...this.realLine.end, x: ((10 - c(1)) / 3) * 2 * this.seed1 + c(1) };
        break;
      case '\\':
        this.realLine.start = { x: 0, y: c(1) };
        this.realLine.end = { x: c(2), y: 10 };
        this.realLine.control1 = { ...this.realLine.start, x: (this.seed0 * c(2)) / 2 + c(2) / 3 };
        this.realLine.control2 = { ...this.realLine.end, y: ((10 - c(1)) / 3) * 2 * this.seed1 + c(1) };
        break;
      case '[':
        this.realLine.start = { x: c(1), y: 10 };
        this.realLine.end = { x: 10, y: c(2) };
        this.realLine.control1 = { ...this.realLine.start, y: c(2) };
        this.realLine.control2 = { ...this.realLine.end, x: 0 };
        break;
      case ']':
        this.realLine.start = { x: 0, y: c(1) };
        this.realLine.end = { x: c(2), y: 10 };
        this.realLine.control1 = { ...this.realLine.start, x: 10 };
        this.realLine.control2 = { ...this.realLine.end, y: c(1) };
        break;
      case '^':
        this.realLine.start = { x: 0, y: 0 };
        this.realLine.mid = { x: 0, y: 0 };
        this.realLine.end = { x: 0, y: 0 };
        this.realLine.control1 = { x: 0, y: 0 };
        this.realLine.control2 = { x: 0, y: 0 };
        this.realLine.control3 = { x: 0, y: 0 };
        this.realLine.control4 = { x: 0, y: 0 };
        break;
      case 'v':
        break;
      case '#':
        break;
      default:
      // '.'
      // This is just air, so do nothing.
    }
    console.log(this.realLine);
  }

  draw = ctx => {
    const { scrollX, scrollY, width, height } = store.getState().stage;
    const x = (scrollX - this.x * chunkSize - width / 2) * -1;
    const y = (scrollY - this.y * chunkSize - height / 2) * -1;

    // ==========
    // GRID Small
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      ctx.moveTo(x, y + (chunkSize / 10) * i);
      ctx.lineTo(x + chunkSize, y + (chunkSize / 10) * i);
    }
    for (let i = 0; i < 10; i++) {
      ctx.moveTo(x + (chunkSize / 10) * i, y);
      ctx.lineTo(x + (chunkSize / 10) * i, y + chunkSize);
    }
    ctx.stroke();
    ctx.restore();
    // ==========

    // ==========
    // GRID Large
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + chunkSize);
    ctx.lineTo(x + chunkSize, y + chunkSize);
    ctx.strokeStyle = '#777777';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();
    // ==========

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + (chunkSize / 10) * this.realLine.start.x, y + (chunkSize / 10) * this.realLine.start.y);
    ctx.bezierCurveTo(
      x + (chunkSize / 10) * this.realLine.control1.x,
      y + (chunkSize / 10) * this.realLine.control1.y,
      x + (chunkSize / 10) * this.realLine.control2.x,
      y + (chunkSize / 10) * this.realLine.control2.y,
      x + (chunkSize / 10) * this.realLine.end.x,
      y + (chunkSize / 10) * this.realLine.end.y
    );
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    // ctx.save();
    // ctx.beginPath();
    // ctx.translate(x, y);
    // ctx.moveTo(2, 2);
    // ctx.lineTo(chunkSize - 2, 2);
    // ctx.lineTo(chunkSize - 2, chunkSize - 2);
    // ctx.lineTo(2, chunkSize - 2);
    // ctx.closePath();
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = '#ffffff';
    // ctx.fillStyle = `rgba(${50 * this.seed0},${50 * this.seed1},${50 * this.seed2},1)`;
    // ctx.stroke();
    // ctx.fill();
    // ctx.restore();
  };
}

export default Chunk;
