var ThrusterExhaust = function(x,y,vx,vy,c) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = c;
  this.alpha = 1;
};
ThrusterExhaust.prototype = {
  draw: function() {
    ctx.beginPath();
    // ctx.arc(this.x, this.y, Math.random() * 7, 0, 2 * Math.PI);
    ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.alpha + ")";
    ctx.fill();
  },
  drift: function() {
    if (this.vx < 0) this.vx += airResistance;
    if (this.vx > 0) this.vx -= airResistance;
    if (this.vy < 0) this.vy += airResistance;
    if (this.vy > 0) this.vy -= airResistance;

    this.vy -= g;

    this.x += this.vx;
    this.y += this.vy;
  },
  fade: function() {
    if (this.alpha > 0) {
      this.alpha -= 0.1;
    }
  }
};
