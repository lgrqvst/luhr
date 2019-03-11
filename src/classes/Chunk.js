import { chunkSize } from '../data/levels';
import store from '../store/store';

class Chunk {
  constructor(descriptor, x, y) {
    this.id = `x${x}y${y}:${descriptor}`;
    this.descriptor = descriptor;
    this.descriptorArray = descriptor.split('');
    this.terrainType = this.descriptorArray[0];
    this.x = x;
    this.y = y;
    this.seed1 = Math.random();
    this.seed2 = Math.random();
    this.seed3 = Math.random();
    this.seed4 = Math.random();
    this.seed5 = Math.random();
    this.seed6 = Math.random();
    this.seed7 = Math.random();
    this.seed8 = Math.random();
    this.seed9 = Math.random();
    this.seed10 = Math.random();
    // console.log(`CHUNK: id: ${this.id}, x: ${x}, y: ${y}, descriptor: ${descriptor}`);
  }

  draw = ctx => {
    const { scrollX, scrollY, width, height } = store.getState().stage;
    const x = (scrollX - this.x * chunkSize - width / 2) * -1;
    const y = (scrollY - this.y * chunkSize - height / 2) * -1;

    // console.log(this.x * chunkSize + ': ' + (offsetX - this.x * chunkSize - width / 2));

    // console.log(`${this.x},${this.y} : ${x}, ${y}`);

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(2, 2);
    ctx.lineTo(chunkSize - 2, 2);
    ctx.lineTo(chunkSize - 2, chunkSize - 2);
    ctx.lineTo(2, chunkSize - 2);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = `rgba(${50 * this.seed1},${50 * this.seed2},${50 * this.seed3},1)`;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  };
}

export default Chunk;
