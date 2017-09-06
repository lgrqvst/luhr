var Exhaust = function(x = sprite.x, y = sprite.y, c = {r: 255, g: 255, b: 255}, length, thickness, targetX, targetY) {
  this.x = x;
  this.y = y;
  this.alpha = 1;
  this.color = c;
  this.length = length;
  this.thickness = thickness;
  this.targetX = targetX;
  this.targetY = targetY;
  this.angle = sprite.rotation; // Used to generate sparks
  this.age = 0;
  return this;
};
Exhaust.prototype = {
  draw: function() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    // ctx.lineTo((this.targetX - (this.targetX - this.x)) / 10, (this.targetY - (this.targetY - this.y)) / 10);
    // ctx.lineTo(this.targetX, this.targetY);
    ctx.lineTo(this.x - (this.x - this.targetX) / this.length, this.y - (this.y - this.targetY) / this.length);
    let color = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + "," + this.alpha + ")";
    ctx.strokeStyle = color;
    ctx.lineWidth = this.thickness * this.age / maxExhaust;
    // ctx.lineWidth = this.thickness;
    ctx.stroke();
  },
  fade: function() {
    if (this.alpha > 0) {
      this.alpha -= 0.01;
    }
  },
  drift: function() {
    this.x -= (this.x - this.targetX) / 10;
    this.y -= (this.y - this.targetY) / 10;
    if(this.x > w) {
      this.x = 0;
      this.targetX -= w;
    }
    if(this.x < 0) {
      this.x = w;
      this.targetX += w;
    }
  }
};
