var Dust = function() {
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h);
  this.r = Math.round(Math.random() * 10);
  this.color = "rgba(" + (Math.round(Math.random() * 50 + 200)) + "," + (Math.round(Math.random() * 50 + 200)) + "," + (Math.round(Math.random()) * 50 + 200) + "," + 0.3 + ")";
  // this.color = {
  //   r: Math.random() * 50 + 200,
  //   g: Math.random() * 50 + 200,
  //   b: Math.random() * 50 + 200,
  // };
  this.driftdistance = 25;
  this.targetX = this.x + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  this.targetY = this.y + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  return this;
};
Dust.prototype = {
  draw: function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  },
  drift: function() {
    let x = (this.targetX - this.x) / (Math.round(Math.random() * 400) + 100);
    let y = (this.targetY - this.y) / (Math.round(Math.random() * 400) + 100);
    this.x += x;
    this.y += y;
    if (this.x > w + this.r) this.x = 0;
    if (this.x < 0 - this.r) this.x = w;
    if (this.y > h + this.r) this.y = 0;
    if (this.y < 0 - this.r) this.y = h;
    if (Math.abs(this.targetX - this.x) < 10 || Math.abs(this.targetX - this.x) > 100) this.targetX = this.x + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
    if (Math.abs(this.targetY - this.y) < 10 || Math.abs(this.targetY - this.y) > 100) this.targetY = this.y + (this.driftdistance - Math.round(Math.random() * this.driftdistance * 2));
  },
  pulsate: function() {

  },
  shrink: function() {

  }
};
