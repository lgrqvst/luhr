'use strict';

const w = window.innerWidth;
const h = window.innerHeight;

let getContext = (w, h) => {
  let canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = w || window.innerWidth;
  canvas.height = h || window.innerHeight;
  return canvas.getContext("2d");
}

const ctx = getContext(w, h);
