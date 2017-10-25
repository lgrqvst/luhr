'use strict';

const VW = window.innerWidth;
const VH = window.innerHeight - 10;

let getContext = (w, h, c) => {
  let canvas = document.createElement("canvas");
  canvas.classList.add(c);
  document.body.appendChild(canvas);
  canvas.width = w || window.innerWidth;
  canvas.height = h || window.innerHeight;
  return canvas.getContext("2d");
}

const context1 = getContext(VW, VH, 'layer1');
const context2 = getContext(VW, VH, 'layer2');
const context3 = getContext(VW, VH, 'layer3');
