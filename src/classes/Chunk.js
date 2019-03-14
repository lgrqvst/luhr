import { chunkSize } from '../data/levels';
import store from '../store/store';

class Chunk {
  constructor(descriptor, x, y) {
    this.id = `x${x}y${y}`;
    this.descriptor = descriptor;
    this.terrainArray = descriptor.split(':')[0].split('');
    this.terrainType = this.terrainArray[0];
    if (this.descriptor.split(':').length > 1) {
      this.objectsArray = descriptor.split(':')[1].split('');
      this.objectType = this.objectsArray[0];
    }
    this.x = x;
    this.y = y;
    this.seed0 = Math.random();
    this.seed1 = Math.random();
    this.seed2 = Math.random();
    this.seed3 = Math.random();
    this.seed4 = Math.random();
    this.seed5 = Math.random();
    this.seed6 = Math.random();
    this.seed7 = Math.random();
    this.seed8 = Math.random();
    this.seed9 = Math.random();
    // console.log(`CHUNK: id: ${this.id}, x: ${x}, y: ${y}, descriptor: ${descriptor}`);

    this.realLine = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, control1: { x: 0, y: 0 }, control2: { x: 0, y: 0 } };

    switch (this.terrainType) {
      case '_':
        this.realLine.start = { x: 0, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.end = { x: 10, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.control1 = this.realLine.start;
        this.realLine.control2 = this.realLine.end;
        break;
      case '-':
        this.realLine.start = { x: 0, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.end = { x: 10, y: parseInt(`0x${this.terrainArray[2]}`) };
        this.realLine.control1 = { ...this.realLine.start, x: this.seed0 * 5 + 2.5 };
        this.realLine.control2 = { ...this.realLine.end, x: this.seed1 * 5 + 2.5 };
        break;
      case '|':
        this.realLine.start = { x: parseInt(`0x${this.terrainArray[1]}`), y: 0 };
        this.realLine.end = { x: parseInt(`0x${this.terrainArray[2]}`), y: 10 };
        this.realLine.control1 = { ...this.realLine.start, y: this.seed0 * 10 };
        this.realLine.control2 = { ...this.realLine.end, y: this.seed1 * 10 };
        break;
      case '(':
        this.realLine.start = { x: 0, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.end = { x: parseInt(`0x${this.terrainArray[2]}`), y: 0 };
        this.realLine.control1 = { ...this.realLine.start, x: this.seed0 * 3 };
        this.realLine.control2 = { ...this.realLine.end, y: this.seed1 * 3 };
        break;
      case ')':
        this.realLine.start = { x: parseInt(`0x${this.terrainArray[1]}`), y: 0 };
        this.realLine.end = { x: 10, y: parseInt(`0x${this.terrainArray[2]}`) };
        this.realLine.control1 = { ...this.realLine.start, y: this.seed0 * 3 };
        this.realLine.control2 = { ...this.realLine.end, x: this.seed1 * 3 + 7 };
        break;
      case '/':
        this.realLine.start = { x: parseInt(`0x${this.terrainArray[1]}`), y: 10 };
        this.realLine.end = { x: 10, y: parseInt(`0x${this.terrainArray[2]}`) };
        this.realLine.control1 = { ...this.realLine.start, y: this.seed0 * 3 + 7 };
        this.realLine.control2 = { ...this.realLine.end, x: this.seed1 * 3 + 7 };
        break;
      case '\\':
        this.realLine.start = { x: 0, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.end = { x: parseInt(`0x${this.terrainArray[2]}`), y: 10 };
        this.realLine.control1 = { ...this.realLine.start, x: this.seed0 * 3 };
        this.realLine.control2 = { ...this.realLine.end, y: this.seed1 * 3 + 7 };
        break;
      case '[':
        this.realLine.start = { x: parseInt(`0x${this.terrainArray[1]}`), y: 10 };
        this.realLine.end = { x: 10, y: parseInt(`0x${this.terrainArray[2]}`) };
        this.realLine.control1 = { x: parseInt(`0x${this.terrainArray[1]}`), y: parseInt(`0x${this.terrainArray[2]}`) };
        this.realLine.control2 = { x: 0, y: parseInt(`0x${this.terrainArray[2]}`) };
        break;
      case ']':
        this.realLine.start = { x: 0, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.end = { x: parseInt(`0x${this.terrainArray[2]}`), y: 10 };
        this.realLine.control1 = { x: 10, y: parseInt(`0x${this.terrainArray[1]}`) };
        this.realLine.control2 = { x: parseInt(`0x${this.terrainArray[2]}`), y: parseInt(`0x${this.terrainArray[1]}`) };
        break;
      case '^':
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
    if (this.terrainType === '(') {
      ctx.strokeStyle = '#ff0000';
    }
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
